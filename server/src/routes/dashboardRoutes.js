import { Router } from "express";
import { getStudentDashboard } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/student", authorize("student"), getStudentDashboard);

export default router;