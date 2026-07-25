import express from "express"
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken
} from "../controllers/userAuth.controller";
import authenticateToken from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser);
router.post("/refresh", refreshUserToken);

export default router;