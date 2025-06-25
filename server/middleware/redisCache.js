const cacheMiddleware = (redisClient, duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Check if Redis is connected and available
    if (!redisClient || !redisClient.isOpen) {
      console.log("Redis not available, skipping cache");
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        console.log("Cache hit for:", key);
        return res.json(JSON.parse(cachedResponse));
      }

      // Store original res.json
      const originalJson = res.json;

      // Override res.json method
      res.json = function (body) {
        // Store in cache if Redis is available
        if (redisClient && redisClient.isOpen) {
          redisClient.setEx(key, duration, JSON.stringify(body))
            .catch(err => console.error("Cache set error:", err));
        }

        // Call original res.json
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error("Redis Cache Error:", error);
      // Continue without caching
      next();
    }
  };
};

export default cacheMiddleware;
