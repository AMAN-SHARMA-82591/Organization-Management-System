import { z } from "zod/v4";
import { NextFunction, Request, Response } from "express";
import Leave, { ILeave } from "../models/leave.model";
import { validateSafeParse } from "../utils/validateRequest";
import { leaveSchema } from "../validators/leaveSchema";
import { LeaveInterface } from "../interfaces/leave.interface";

// const findLeaveById = (id: number) => leaves.find((l) => l.id === id);

export const getLeaves = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;
  try {
    if (userId) {
      const userLeaves = await Leave.find({ user: userId });
      return res.json(userLeaves);
    }
    res.status(200).json({ success: true, message: "Fetched leaves list." });
  } catch (error) {
    next(error);
  }
};

export const createLeave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const { startDate, endDate, reason } = validateSafeParse<
      z.infer<typeof leaveSchema>
    >(leaveSchema, req);
    const newLeave: LeaveInterface = await Leave.create({
      user: userId,
      startDate,
      endDate,
      reason,
      status: "pending",
    });
    res.status(201).json({
      success: true,
      message: "Leave successfully created.",
      leave: newLeave,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelLeave = (req: Request, res: Response) => {
  // const userId = req.user?.id;
  // const id = Number(req.params.id);
  // const leave = findLeaveById(id);
  // if (!leave) return res.status(404).json({ message: "Leave not found." });
  // if (leave.userId !== userId)
  //   return res.status(403).json({ message: "Forbidden" });
  // if (leave.status !== "pending" && leave.status !== "approved") {
  //   return res
  //     .status(400)
  //     .json({ message: `Cannot cancel leave with status '${leave.status}'` });
  // }
  // leave.status = "cancelled";
  // leave.updatedAt = new Date().toISOString();
  // res.json(leave);
};

export const rejectLeave = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // const leave = findLeaveById(id);
  // if (!leave) return res.status(404).json({ message: "Leave not found." });
  // if (leave.status !== "pending") {
  //   return res
  //     .status(400)
  //     .json({ message: `Cannot reject leave with status '${leave.status}'` });
  // }
  // leave.status = "rejected";
  // leave.updatedAt = new Date().toISOString();
  // res.json(leave);
};
