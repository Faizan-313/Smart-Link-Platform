import express from "express"
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken
} from "../controllers/userAuth.controller";
import authenticateToken from "../middleware/auth.middleware";
import rateLimitter from "../middleware/rateLimitter.middleware";

const router = express.Router();

router.post("/register", rateLimitter, registerUser);
router.post("/login", rateLimitter, loginUser);
router.post("/logout", authenticateToken, logoutUser);
router.post("/refresh", rateLimitter, refreshUserToken);

export default router;