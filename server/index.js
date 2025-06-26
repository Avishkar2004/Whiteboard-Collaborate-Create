import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { connectRedis, redisClient } from "./config/redis.js";
import cacheMiddleware from "./middleware/redisCache.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import morgan from "morgan";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// CORS configuration - MUST be applied before any routes
const allowedOrigins = [
  "http://localhost:5173", // Development
  "http://localhost:3000", // Alternative dev port
  "https://whiteboard-collaborate-create.vercel.app", // Production
  process.env.CLIENT_URL, // Environment variable for additional origins
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Other middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes that don't need database - START IMMEDIATELY
app.get("/", (req, res) => {
  res.send("Server is running  🚀🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Server is healthy",
  });
});

// Test endpoint for debugging
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method,
  });
});

// POST test endpoint for CORS
app.post("/api/cors-test", (req, res) => {
  res.json({
    message: "POST CORS is working!",
    timestamp: new Date().toISOString(),
    body: req.body,
    origin: req.headers.origin,
    method: req.method,
  });
});

// Database status endpoint
app.get("/api/db-status", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: global.dbConnected ? "connected" : "disconnected",
    redis: global.redisConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

// Database-dependent routes with fallback
app.use("/api/users", (req, res, next) => {
  // Check if database is connected
  if (global.dbConnected) {
    return userRoutes(req, res, next);
  } else {
    return res.status(503).json({
      message: "Database connection is not available",
      error: "Service temporarily unavailable",
    });
  }
});

app.use("/api/whiteboards", (req, res, next) => {
  // Check if database is connected
  if (global.dbConnected) {
    return whiteboardRoutes(req, res, next);
  } else {
    return res.status(503).json({
      message: "Database connection is not available",
      error: "Service temporarily unavailable",
    });
  }
});

// Socket.IO server (enabled in production when ENABLE_SOCKET is true)
if (
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_SOCKET === "true"
) {
  console.log("🔌 Socket.IO server enabled");
  
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    transports: ['polling', 'websocket'], // Support both polling and websockets
    allowEIO3: true, // Allow Engine.IO v3 clients
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`🔌 User ${socket.id} joined room ${roomId}`);
    });

    socket.on("draw", (data) => {
      // Broadcast to all users in the room except sender
      socket.to(data.roomId).emit("draw", data);
      console.log(`🔌 Drawing broadcasted in room ${data.roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });
} else {
  console.log("🔌 Socket.IO server disabled in production");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server immediately (for serverless, this is handled by Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    // console.log(`CORS origins: ${allowedOrigins.join(", ")}`);
  });
}

// Connect to databases in the background (non-blocking)
const initializeDatabases = async () => {
  try {
    // Try to connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");
    global.dbConnected = true;
  } catch (err) {
    console.log("❌ MongoDB connection failed:", err.message);
    global.dbConnected = false;
  }

  try {
    // Try to connect to Redis
    await connectRedis();
    console.log("✅ Redis connected");
    global.redisConnected = true;
    // Apply Redis cache middleware after connection
    app.use(cacheMiddleware(redisClient, 60));
  } catch (err) {
    console.log("❌ Redis connection failed:", err.message);
    global.redisConnected = false;
  }
};

// Initialize databases immediately
initializeDatabases();

// Also try to reconnect every 30 seconds if not connected
setInterval(() => {
  if (!global.dbConnected || !global.redisConnected) {
    console.log("Attempting to reconnect to databases...");
    initializeDatabases();
  }
}, 30000);

export default app; // Export app instead of server for serverless
