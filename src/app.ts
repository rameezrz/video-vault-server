import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes";
app.use("/api/auth", authRoutes);

export default app;
