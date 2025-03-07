import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
