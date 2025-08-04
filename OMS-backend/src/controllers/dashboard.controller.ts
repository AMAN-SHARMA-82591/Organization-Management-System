import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await User.findById({ _id: req.user._id })
      .select("-password")
      .lean();
    if (!userData) {
      res.status(403).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Success. Dashboard is still in progress!",
      data: {
        upcomingHolidays: [],
        newJoinees: [],
        leaveReport: {
          availablePaidLeaves: 0,
          availableSickLeaves: 0,
          availableUnpaidLeaves: 0,
          availableVacationLeaves: 0,
          user: userData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
