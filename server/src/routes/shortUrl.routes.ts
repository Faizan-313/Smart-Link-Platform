import { Router } from "express";
import {
    createUrl,
    getAllUrl,
    redirectUrl,
    deleteUrl,
    getUserUrls,
} from "../controllers/shortUrl.controller"
import authenticateToken from "../middleware/auth.middleware";
import { userRateLimitter } from "../middleware/rateLimitter.middleware";

const router = Router();

router.post("/shortUrl", authenticateToken, userRateLimitter, createUrl);
router.get("/shortUrl", authenticateToken, userRateLimitter, getAllUrl);
router.get("/shortUrl/user", authenticateToken, userRateLimitter, getUserUrls);
router.get("/shortUrl/:id", authenticateToken, userRateLimitter, redirectUrl);
router.delete("/shortUrl/:id", authenticateToken, userRateLimitter, deleteUrl);

export default router;