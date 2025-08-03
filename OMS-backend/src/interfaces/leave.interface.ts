import { LeaveStatus } from "../utils/constants";
import { IUser } from "../models/user.model";

export interface LeaveInterface {
  user: IUser["_id"];
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
}
