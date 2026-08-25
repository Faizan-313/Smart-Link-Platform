import express from "express"
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken
} from "../controllers/userAuth.controller";
import authenticateToken from "../middleware/auth.middleware";
import { authRateLimitter } from "../middleware/rateLimitter.middleware";

const router = express.Router();

router.post("/register", authRateLimitter, registerUser);
router.post("/login", authRateLimitter, loginUser);
router.post("/logout", authenticateToken, logoutUser);
router.post("/refresh", authRateLimitter, refreshUserToken);

export default router;