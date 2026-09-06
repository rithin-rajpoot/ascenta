import { Router } from "express";
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestoneController.js";

// mergeParams lets this router access :projectId from the parent route path.
const router = Router({ mergeParams: true });

router.get("/", getMilestones);
router.post("/", createMilestone);
router.put("/:milestoneId", updateMilestone);
router.delete("/:milestoneId", deleteMilestone);

export default router;