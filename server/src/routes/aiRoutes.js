import { Router } from "express";
import {
  generateProjectIdeas,
  generateProjectFeatures,
  generateProjectSdgs,
  generateProjectBlueprint,
} from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// AI routes require authentication and student role
router.use(protect);
router.use(authorize("student"));

router.post("/project-ideas", generateProjectIdeas);
router.post("/project-features", generateProjectFeatures);
router.post("/project-sdgs", generateProjectSdgs);
router.post("/project-blueprint", generateProjectBlueprint);

export default router;
