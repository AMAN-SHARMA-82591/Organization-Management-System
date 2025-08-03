import express from "express";
import {
  getLeaves,
  createLeave,
  cancelLeave,
  rejectLeave,
} from "../controllers/leave.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", getLeaves);
router.post("/", createLeave);
// router.get("/:id", findLeaveById);
router.post("/:id/cancel", cancelLeave);
router.post("/:id/reject", rejectLeave);

export default router;
