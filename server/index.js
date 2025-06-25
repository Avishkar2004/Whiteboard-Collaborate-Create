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
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Access-Control-Allow-Origin"],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Other middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes that don't need database
app.get("/", (req, res) => {
  res.send("Server is running  🚀🚀");
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    message: "Server is healthy"
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
    method: req.method
  });
});

// POST test endpoint for CORS
app.post("/api/cors-test", (req, res) => {
  res.json({ 
    message: "POST CORS is working!", 
    timestamp: new Date().toISOString(),
    body: req.body,
    origin: req.headers.origin,
    method: req.method
  });
});

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinWhiteboard", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined whiteboard ${boardId}`);
  });

  socket.on("whiteboardUpdate", ({ boardId, data }) => {
    socket.to(boardId).emit("whiteboardUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server immediately
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`CORS origins: ${allowedOrigins.join(", ")}`);
});

// Try to connect to databases in the background
let dbConnected = false;
let redisConnected = false;

// Connect to Redis
connectRedis()
  .then(() => {
    console.log("✅ Redis connected");
    redisConnected = true;
    // Apply Redis cache middleware after connection
    app.use(cacheMiddleware(redisClient, 60));
  })
  .catch((err) => {
    console.log("❌ Redis connection failed:", err.message);
    // Continue without Redis
  });

// Connect to MongoDB
connectDB
  .then(() => {
    console.log("✅ MongoDB connected");
    dbConnected = true;
    // Apply routes that need database
    app.use("/api/users", userRoutes);
    app.use("/api/whiteboards", whiteboardRoutes);
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
    // Add error handling for database routes
    app.use("/api/users", (req, res) => {
      res.status(503).json({ 
        message: "Database connection is not available",
        error: "Service temporarily unavailable"
      });
    });
    app.use("/api/whiteboards", (req, res) => {
      res.status(503).json({ 
        message: "Database connection is not available",
        error: "Service temporarily unavailable "
      });
    });
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default server;

