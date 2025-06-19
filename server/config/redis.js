import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const connectRedis = redisClient.connect()
  .then(() => {
    console.log("🔴 Redis Client Connected");
    return redisClient;
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
    process.exit(1);
  });

export { redisClient, connectRedis };