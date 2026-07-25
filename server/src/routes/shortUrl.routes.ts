import { Router } from "express";
import {
    createUrl,
    getAllUrl,
    getUrl,
    deleteUrl
} from "../controllers/shortUrl.controller"
import authenticateToken from "../middleware/auth.middleware";

const router = Router();

router.post("/shortUrl", authenticateToken, createUrl);
router.get("/shortUrl", authenticateToken, getAllUrl);
router.get("/shortUrl/:id", authenticateToken, getUrl);
router.delete("/shortUrl/:id", authenticateToken, deleteUrl);

export default router;