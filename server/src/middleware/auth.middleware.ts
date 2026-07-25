import jwt from "jsonwebtoken"
import express from "express"

import { AuthenticatedRequest } from "../types/main.types";

const authenticateToken = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });
        if (typeof decodedToken === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error in auth middleware", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authenticateToken;