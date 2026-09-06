import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

// mergeParams lets this router access :projectId from the parent route path.
const router = Router({ mergeParams: true });

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;