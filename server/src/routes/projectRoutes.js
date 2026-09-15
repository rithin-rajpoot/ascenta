import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
  getTeamProjectsController,
} from "../controllers/projectController.js";
import milestoneRoutes from "./milestoneRoutes.js";
import taskRoutes from "./taskRoutes.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All project routes require authentication. Students and the assigned faculty
// reviewer may read project data; mutating routes below are student-only
// (controllers additionally enforce owner/leader permissions).
router.use(protect);
router.use(authorize("student", "faculty"));

router.post("/", authorize("student"), createProjectController);
// Must be declared before "/:id" so "team/:teamId" is not matched as an id
router.get("/team/:teamId", authorize("student"), getTeamProjectsController);
router.use("/:projectId/milestones", milestoneRoutes);
router.use("/:projectId/tasks", taskRoutes);
router.get("/:id", getProjectController);
router.put("/:id", authorize("student"), updateProjectController);
router.delete("/:id", authorize("student"), deleteProjectController);

export default router;
