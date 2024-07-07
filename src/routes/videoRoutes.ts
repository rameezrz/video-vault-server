import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { uploadVideo } from "../controllers/videoController";

const router = express.Router();

router.post("/upload", verifyToken, uploadVideo);

export default router;
