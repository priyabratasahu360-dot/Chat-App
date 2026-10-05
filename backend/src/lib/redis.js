import {Redis} from "ioredis";

//if you are starting application using docker use local redis instance
//change REDIS_URL to REDIS_DEV_URL or peek inside .env.example 😂
const redisUrl = process.env.REDIS_URL;

if(!redisUrl){
    throw new Error("Missing redis url in env");
}

//connect to hosted redis instance
export const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("Connected to redis instance"));
redis.on("error", (error) => console.log("Redis error: ", error));
