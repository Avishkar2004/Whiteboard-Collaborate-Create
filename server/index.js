import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { connectRedis, redisClient } from "./config/redis.js";
import cacheMiddleware from "./middleware/redisCache.js";
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
