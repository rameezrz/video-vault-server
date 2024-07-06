import express from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", refreshAccessToken);

export default router;
