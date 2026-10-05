import {redis} from "../lib/redis.js";

export const rateLimiter = async(req, res ,next) => {

    // NOTE: For production on Render, ensure 'app.set("trust proxy", 1)' 
    // is enabled in entry point i.e index.js so this reads the real user's IP 
    // instead of Render's load balancer IP.
    const ip = req.ip;
    const key = `rate:limit:${ip}`;
    const LIMIT = 10; //maximus req allowed
    const COOLDOWN_TIME = 60; //cooldown time of 60sec after exceding limit

    try{
        const requests = await redis.incr(key);

        if(requests > LIMIT){
            await redis.expire(key, COOLDOWN_TIME);
            return res.status(429).json({message: "Too many requests, please try again later"});
        }

        next();
    }
    catch(error){
        console.log("Redis error: ", error);
        next(); //fallback to prevent the app from crash if redis is down
    }
}