export interface LeaveRequest {
  id: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  typeOfLeave: string;
  comment: string;
  isApproved: boolean;
  isCancelled: boolean;
  noOfDays: number;
  createdBy: string;
  leaveBreakups: string;
}

export interface LeaveBreakup {
  startDate: Date;
  endDate: Date;
  timeOfDay: string;
  noOfDays: number;
  isApproved: boolean;
}
