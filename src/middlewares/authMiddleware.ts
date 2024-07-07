import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { AuthenticatedRequest } from "../types/user";

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ENV.ACCESS_TOKEN_SECRET!, (err, user) => {
    console.log({ token, env: ENV.ACCESS_TOKEN_SECRET! });
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
