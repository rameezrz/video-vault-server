import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.ACCESS_TOKEN_SECRET!, {
    expiresIn: ENV.TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.REFRESH_TOKEN_SECRET!, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRATION,
  });
};

export { generateAccessToken, generateRefreshToken };
