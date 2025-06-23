import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { connectRedis, redisClient } from "./config/redis.js";
import cacheMiddleware from "./middleware/redisCache.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Redis
app.use(cacheMiddleware(redisClient, 60));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/whiteboards", whiteboardRoutes);

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
