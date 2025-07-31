export interface LeaveTracker {
  startDate: string;
  endDate: string;
  leaveBreakups: {
    startDate: string;
    endDate: string;
    noOfDays: number;
    timeOfDay: string;
  }[];
  reason: string;
  noOfDays: number;
  typeOfLeave: string;
  reportingManager: number;
}

export interface ApprovedLeaveTracker {
  approvedStartDate: string;
  approvedEndDate: string;
  approvedLeaveBreakups: {
    startDate: string;
    endDate: string;
    noOfDays: number;
    timeOfDay: string;
  }[];
  comment: string;
}

export interface UserLeaveData {
  availablePaidLeaves: number;
  approvedLeaves: number;
  availableUnpaidLeaves: number;
  availableSickLeaves: number;
  bookedLeaves: number;
  availableVacationLeaves: number;
  totalLeaves: number;
}
