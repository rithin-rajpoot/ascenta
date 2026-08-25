import { Router } from "express";
import {
  createTeamController,
  getTeamController,
  inviteMemberController,
  joinTeamController,
  removeMemberController,
  getUserTeamsController,
} from "../controllers/teamController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All team routes require authentication
router.use(protect);

router.post("/", authorize("student"), createTeamController);
router.get("/my-teams", authorize("student"), getUserTeamsController);
router.get("/:id", getTeamController);
router.post("/:id/invite", authorize("student"), inviteMemberController);
router.post("/:id/join", authorize("student"), joinTeamController);
router.delete("/:id/members/:userId", authorize("student"), removeMemberController);

export default router;