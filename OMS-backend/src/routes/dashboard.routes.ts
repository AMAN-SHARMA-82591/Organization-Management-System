import express from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.use(authenticateJWT);

router.get("/", getDashboard);

export default router;
