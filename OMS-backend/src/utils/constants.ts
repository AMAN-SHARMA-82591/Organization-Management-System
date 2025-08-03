export const JWT_SECRET: string = process.env.JWT_SECRET || "secret_key";
export const JWT_EXPIRES_IN: number = 24 * 60 * 60;

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export const currentDate = new Date().toISOString();
