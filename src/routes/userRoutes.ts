import express from "express";
import { addBio, saveAvatar } from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/avatar", verifyToken, saveAvatar);
router.post("/bio", verifyToken, addBio);

export default router;
