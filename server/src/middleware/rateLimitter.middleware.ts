import express from "express"
import { redisClient } from "../config/redis.config"

import { AuthenticatedRequest } from "../types/main.types";

const authRateLimitter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const ipAddress = req.ip;
        const key = `rl:auth:ip:${ipAddress}`;

        const requestCount = await redisClient.incr(key);
        if (requestCount === 1) {
            await redisClient.expire(key, 60); 
        }  

        if (requestCount > 5){
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
    } catch (error) {
        console.error("Error in rate limitter middleware", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const userRateLimitter = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    try {
        const ipAddress = req.ip;
        const userId = req.user?._id;
        const key = `rl:links:user:${userId || ipAddress}`;

        const requestCount = await redisClient.incr(key);
        if (requestCount === 1) {
            await redisClient.expire(key, 60); 
        }  

        if (requestCount > 100){
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
    } catch (error) {
        console.error("Error in rate limitter middleware", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    authRateLimitter,
    userRateLimitter
};