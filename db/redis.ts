import { createClient } from "redis";


const redisClient = createClient({
    ...(process.env.REDIS_USERNAME && { username: process.env.REDIS_USERNAME }),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
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
