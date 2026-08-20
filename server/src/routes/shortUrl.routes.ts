import { Router } from "express";
import {
    createUrl,
    getAllUrl,
    redirectUrl,
    deleteUrl,
    getUserUrls,
} from "../controllers/shortUrl.controller"
import authenticateToken from "../middleware/auth.middleware";

const router = Router();

router.post("/shortUrl", authenticateToken, createUrl);
router.get("/shortUrl", authenticateToken, getAllUrl);
router.get("/shortUrl/user", authenticateToken, getUserUrls);
router.get("/shortUrl/:id", authenticateToken, redirectUrl);
router.delete("/shortUrl/:id", authenticateToken, deleteUrl);

export default router;