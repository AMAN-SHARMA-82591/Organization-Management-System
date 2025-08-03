import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";
import { LeaveStatus } from "../utils/constants";


export interface ILeave extends Document {
  user: IUser["_id"];
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema: Schema<ILeave> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Leave: Model<ILeave> = mongoose.model("Leave", LeaveSchema);
export default Leave;
