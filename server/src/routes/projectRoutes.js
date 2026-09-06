import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  updateProjectController,
  getTeamProjectsController,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All project routes require authentication and student role
router.use(protect);
router.use(authorize("student"));

router.post("/", createProjectController);
// Must be declared before "/:id" so "team/:teamId" is not matched as an id
router.get("/team/:teamId", getTeamProjectsController);
router.get("/:id", getProjectController);
router.put("/:id", updateProjectController);

export default router;
