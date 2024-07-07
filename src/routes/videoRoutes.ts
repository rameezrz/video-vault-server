import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { getUserVideos, uploadVideo } from "../controllers/videoController";

const router = express.Router();

router.post("/upload", verifyToken, uploadVideo);
router.get("/user", verifyToken, getUserVideos);

export default router;
