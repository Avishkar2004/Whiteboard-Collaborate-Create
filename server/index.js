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

// CORS configuration
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
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Redis
app.use(cacheMiddleware(redisClient, 60));

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is running  🚀🚀🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/whiteboards", whiteboardRoutes);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

Promise.all([connectRedis, connectDB])
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB or Redis:", err);
    process.exit(1);
  });

export default server;
