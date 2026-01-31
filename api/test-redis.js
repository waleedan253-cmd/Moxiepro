import Redis from "ioredis";

export default async function handler(req, res) {
  try {
    const redis = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });

    // Test connection
    await redis.set("test-key", "test-value");
    const value = await redis.get("test-key");
    await redis.del("test-key");

    return res.status(200).json({
      success: true,
      message: "Redis connection works!",
      testValue: value,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
