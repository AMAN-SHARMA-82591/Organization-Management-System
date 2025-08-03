import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import leaveRoutes from "./leave.routes";
import designationRoutes from "./designation.routes";
import organizationRoutes from "./organization.routes";

export default function setupRoutes(app: Router) {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/leave", leaveRoutes);
  app.use("/api/v1/designation", designationRoutes);
  app.use("/api/v1/organization", organizationRoutes);
}
