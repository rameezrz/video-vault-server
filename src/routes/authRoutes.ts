import express from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
