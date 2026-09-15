import { Router } from "express";
import {
  getFacultyList,
  getAssignedProjects,
  getFacultyProjectDetail,
  getProjectReviews,
  createReview,
  assignFaculty,
} from "../controllers/facultyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All faculty routes require authentication.
router.use(protect);

// Any authenticated user (students use this to pick a faculty reviewer).
router.get("/", getFacultyList);

// Faculty-only: assigned projects and project detail.
router.get("/projects", authorize("faculty"), getAssignedProjects);
router.get("/projects/:projectId", authorize("faculty"), getFacultyProjectDetail);

// Feedback: assigned faculty submits; project members / assigned faculty view.
router.post("/projects/:projectId/reviews", authorize("faculty"), createReview);
router.get("/projects/:projectId/reviews", getProjectReviews);

// Students (owner/leader) assign the faculty reviewer.
router.post("/projects/:projectId/assign", assignFaculty);

export default router;