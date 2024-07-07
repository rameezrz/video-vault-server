import { Response } from "express";
import { AuthenticatedRequest } from "../types/user";
import User from "../models/User";
import Video from "../models/Video";

export const saveAvatar = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).json({ message: "avatar is required" });
  }
  try {
    await User.updateOne({ _id: userId }, { avatar }).then((response) => {
      res.status(200).json({ message: "Avatar updated Successfully" });
    });
  } catch (error) {
    res.status(403).json({ message: "Error Saving Avatar", error });
  }
};

export const addBio = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user;
  const { bio } = req.body;

  if (!bio) {
    return res.status(400).json({ message: "Bio is required" });
  }
  if (bio.split(" ").length > 500) {
    return res.status(400).json({ message: "Bio cannot exceed 500 words" });
  }
  try {
    await User.updateOne({ _id: userId }, { bio }).then((response) => {
      res.status(200).json({ message: "Bio updated Successfully" });
    });
  } catch (error) {
    res.status(403).json({ message: "Error Saving Bio", error });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const videos = await Video.find({ userId }).lean();

    const userProfile = {
      ...user,
      videos,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile and videos", error });
  }
};
