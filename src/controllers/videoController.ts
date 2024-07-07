import { Response } from "express";
import { AuthenticatedRequest } from "../types/user";
import Video from "../models/Video";
import User from "../models/User";

export const uploadVideo = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user;
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res
      .status(400)
      .json({ message: "All fields are required (title, description, url)" });
  }

  try {
    const video = new Video({
      userId,
      title,
      description,
      url,
    });
    await video.save().then((video) => {
      res.status(201).json({ message: "Video Created Successfully", video });
    });
  } catch (error) {
    res.status(403).json({ message: "Error Creating Video", error });
  }
};

export const getUserVideos = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.user;

  try {
    const videos = await Video.find({ userId });

    res.status(200).json({
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};

export const getAllVideos = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const users = await User.find().select("-password").lean();

    const usersWithVideos = await Promise.all(
      users.map(async (user) => {
        const videos = await Video.find({ userId: user._id }).limit(5).lean();
        return {
          ...user,
          videos,
        };
      })
    );

    res.status(200).json(usersWithVideos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users and videos", error });
  }
};
