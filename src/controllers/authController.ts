import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { ENV } from "../config/env";
// import { sendWelcomeEmail } from '../utils/mailer';

export const registerUser = async (req: Request, res: Response) => {
  let { firstName, lastName, email, mobile } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (mobile.length < 10) {
    return res.status(400).json({ message: "Invalid Mobile Number" });
  }

  firstName = firstName.trim().toLowerCase();
  lastName = lastName.trim().toLowerCase();
  email = email.trim().toLowerCase();

  try {
    // Check if a user with the same email or mobile number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or mobile number already exists",
      });
    }

    // Generate a password based on parts of firstName, lastName, and mobile number
    const password = `${firstName.slice(0, 2)}${lastName.slice(-2)}${mobile}`;
    console.log(`Generated password: ${password}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send welcome email with the generated password
    //   await sendWelcomeEmail(email, firstName, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { firstName, password } = req.body;

  if (!firstName || !password) {
    return res
      .status(400)
      .json({ message: "First name and password are required" });
  }

  try {
    // Extract parts of the password (assuming known format)
    const mobilePart = password.slice(4);

    // Find user by parts extracted from password
    const user = await User.findOne({
      mobile: mobilePart,
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid first name or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid first name or password" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set access token in response headers
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // Set refresh token as httpOnly, secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production", // Set to true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Invalid or expired refresh token", error });
  }
};
