import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import User, { IUser } from "../models/user.model";
import { loginSchema, registerSchema } from "../validators/authSchema";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/constants";
import { validateSafeParse } from "../utils/validateRequest";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = validateSafeParse<
    z.infer<typeof registerSchema>
  >(registerSchema, req);
  try {
    const existingUser = await User.findOne({ email }).select("email").lean();
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    const salt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      organization: null,
      designation: null,
      role: "user",
    });
    await newUser.save();
    const token = jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
        organization: null,
        designation: null,
        role: "user",
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = validateSafeParse<z.infer<typeof loginSchema>>(
    loginSchema,
    req
  );
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }
    const token = jwt.sign(
      {
        _id: user.id,
        role: user.role,
        username: user.username,
        designation: user.designation,
        organization: user.organization,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
