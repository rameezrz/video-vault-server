import { Request } from "express";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  avatar?: string;
  bio?: string;
};

export interface AuthenticatedRequest extends Request {
  user?: any;
}
