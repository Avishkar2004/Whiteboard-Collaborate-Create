import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 13025,
    connectTimeout: 5000, // 5 seconds timeout
    lazyConnect: true, // Don't connect immediately
  },
});

// Handle Redis connection events
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("🔴 Redis Client Connected");
});

redisClient.on("ready", () => {
  console.log("🔴 Redis Client Ready");
});

redisClient.on("end", () => {
  console.log("🔴 Redis Client Disconnected");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return redisClient;
  } catch (err) {
    console.error("Redis connection error:", err);
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw err;
  }
};

export { redisClient, connectRedis };
