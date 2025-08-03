import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  try {
    const userData = await User.find().select("-password").lean();
    res.status(200).json({ success: true, message: "Users list.", userData });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.id;
  try {
    const user = await User.findById({ _id: id }).select('-password').lean();
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = (req: Request, res: Response) => {
  // const { name, email, organizationId, designationId } = req.body;
  // const newUser: User = {
  //   id: Date.now(),
  //   name,
  //   email,
  //   organizationId,
  //   designationId,
  // };
  // users.push(newUser);
  // res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // const index = users.findIndex((u) => u.id === id);
  // if (index === -1) return res.status(404).json({ message: "User not found." });
  // users[index] = { ...users[index], ...req.body };
  // res.json(users[index]);
};

export const deleteUser = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // users = users.filter((u) => u.id !== id);
  // res.status(204).send();
};
