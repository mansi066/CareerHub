import { createClient } from "redis";

// Helper function to extract hostname from Redis URL
const getRedisHost = () => {
    const host = process.env.REDIS_HOST || 'localhost';
    // Remove protocol prefix if present (redis://, rediss://)
    let cleanHost = host.replace(/^redis:\/\/|^rediss:\/\//, '');
    // Remove port if present (e.g., 127.0.0.1:6379 -> 127.0.0.1)
    cleanHost = cleanHost.split(':')[0];
    return cleanHost;
};

const redisClient = createClient({
    ...(process.env.REDIS_USERNAME && { username: process.env.REDIS_USERNAME }),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
    socket: {
        host: getRedisHost(),
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Connected to Redis");
        } else {
            console.log("Redis already connected");
        }
    } catch (err) {
        console.error("Redis connection error:", err);
    }
})();

export default redisClient;
