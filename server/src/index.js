import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import connectDB from "../config/db.js";
import cacheMiddleware from "../middleware/redisCache.js";

// Import routes
import userRoutes from "../routes/userRoutes.js";
import whiteboardRoutes from "../routes/whiteboardRoutes.js";

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

// Cache middleware
app.use(cacheMiddleware(60));

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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
