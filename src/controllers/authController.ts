import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
// import { sendWelcomeEmail } from '../utils/mailer';

export const registerUser = async (req: Request, res: Response) => {
  let { firstName, lastName, email, mobile } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
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
    const password = `${firstName.slice(0, 2)}${lastName.slice(
      -2
    )}${mobile.slice(-4)}`;
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
    const fnPart = password.slice(0, 2);
    const lnPart = password.slice(2, 4);
    const mobilePart = password.slice(4);

    // Find user by parts extracted from password
    const user = await User.findOne({
      firstName: new RegExp(`^${fnPart}`, "i"),
      lastName: new RegExp(`${lnPart}$`, "i"),
      mobile: new RegExp(`${mobilePart}$`),
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
    console.log(String(user?._id));
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};
