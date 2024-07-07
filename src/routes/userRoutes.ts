import express from "express";
import { addBio, getUser, saveAvatar } from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:userId", getUser);
router.post("/avatar", verifyToken, saveAvatar);
router.post("/bio", verifyToken, addBio);

export default router;
