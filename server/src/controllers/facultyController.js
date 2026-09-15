import * as facultyService from "../services/facultyService.js";
import * as dashboardService from "../services/dashboardService.js";
import { isProjectMember } from "../utils/projectAccess.js";

export const getFacultyList = async (req, res, next) => {
  try {
    const faculty = await facultyService.getFacultyList();
    res.status(200).json({ success: true, faculty });
  } catch (error) {
    next(error);
  }
};

export const getFacultyDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getFacultyDashboard(req.user._id);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

export const getAssignedProjects = async (req, res, next) => {
  try {
    const projects = await facultyService.getAssignedProjects(req.user._id);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

export const getFacultyProjectDetail = async (req, res, next) => {
  try {
    const detail = await facultyService.getFacultyProjectDetail(req.params.projectId, req.user._id);
    res.status(200).json({ success: true, ...detail });
  } catch (error) {
    next(error);
  }
};

export const getProjectReviews = async (req, res, next) => {
  try {
    // Students must be project members; assigned faculty can also view.
    const project = await (await import("../services/projectService.js")).getProjectById(
      req.params.projectId
    );
    const isMember = await isProjectMember(project, req.user._id);
    const isAssigned =
      String(project.assignedFaculty?._id || project.assignedFaculty || "") === String(req.user._id);

    if (!isMember && !isAssigned) {
      return res.status(403).json({ success: false, message: "Not authorized to view this project's feedback" });
    }

    const reviews = await facultyService.getProjectReviews(req.params.projectId);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    if (!req.body.comment || !req.body.comment.trim()) {
      return res.status(400).json({ success: false, message: "Feedback comment is required" });
    }
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const review = await facultyService.createReview({
      projectId: req.params.projectId,
      facultyId: req.user._id,
      comment: req.body.comment,
      rating: req.body.rating,
    });

    const populated = await (await import("../models/FacultyReview.js")).default
      .findById(review._id)
      .populate("faculty", "name email");

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

export const assignFaculty = async (req, res, next) => {
  try {
    if (!req.body.facultyId) {
      return res.status(400).json({ success: false, message: "facultyId is required" });
    }
    const project = await facultyService.assignFaculty({
      projectId: req.params.projectId,
      facultyId: req.body.facultyId,
      requester: req.user,
    });
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};