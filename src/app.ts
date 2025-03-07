import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import videoRoutes from "./routes/videoRoutes";

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Video-Vault API...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

export default app;
