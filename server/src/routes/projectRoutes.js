import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  updateProjectController,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All project routes require authentication and student role
router.use(protect);
router.use(authorize("student"));

router.post("/", createProjectController);
router.get("/:id", getProjectController);
router.put("/:id", updateProjectController);

export default router;
