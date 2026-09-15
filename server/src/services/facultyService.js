import Project from "../models/Project.js";
import FacultyReview from "../models/FacultyReview.js";
import * as milestoneService from "./milestoneService.js";
import * as taskService from "./taskService.js";
import * as projectService from "./projectService.js";
import { notifyMany } from "./notificationService.js";

// List all faculty members (used by students when assigning a reviewer).
export const getFacultyList = async () => {
  const { default: User } = await import("../models/User.js");
  return User.find({ role: "faculty" }).select("name email");
};

// Projects assigned to a faculty member.
export const getAssignedProjects = async (facultyId) => {
  return Project.find({ assignedFaculty: facultyId })
    .populate("owner", "name email")
    .populate({
      path: "team",
      select: "name leader members",
      populate: { path: "leader members", select: "name email" },
    })
    .sort("-createdAt");
};

// Full review context for one project: project, milestones, tasks, reviews.
export const getFacultyProjectDetail = async (projectId, facultyId) => {
  const project = await projectService.getProjectById(projectId);
  if (String(project.assignedFaculty?._id || project.assignedFaculty || "") !== String(facultyId)) {
    const error = new Error("This project is not assigned to you");
    error.status = 403;
    throw error;
  }

  const [milestones, tasks, reviews] = await Promise.all([
    milestoneService.getMilestonesByProject(projectId),
    taskService.getTasksByProject(projectId),
    getProjectReviews(projectId),
  ]);

  return { project, milestones, tasks, reviews };
};

export const getProjectReviews = async (projectId) => {
  return FacultyReview.find({ project: projectId })
    .populate("faculty", "name email")
    .sort("-createdAt");
};

export const createReview = async ({ projectId, facultyId, comment, rating }) => {
  const project = await projectService.getProjectById(projectId);
  if (String(project.assignedFaculty?._id || project.assignedFaculty || "") !== String(facultyId)) {
    const error = new Error("Only the assigned faculty member can submit feedback");
    error.status = 403;
    throw error;
  }
  const review = await FacultyReview.create({
    project: projectId,
    faculty: facultyId,
    comment,
    rating: rating || null,
  });

  // Notify the team (owner + leader, Phase 10) — fire-and-forget.
  if (project.team) {
    const { default: Team } = await import("../models/Team.js");
    const team = await Team.findById(project.team._id || project.team);
    if (team) {
      const { default: User } = await import("../models/User.js");
      const facultyUser = await User.findById(facultyId).select("name");
      const recipients = [project.owner?._id || project.owner, String(team.leader)].filter(Boolean);
      notifyMany(recipients, {
        type: "faculty_feedback",
        title: "New faculty feedback",
        message: `${facultyUser?.name || "Your faculty reviewer"} left feedback on “${project.title}”.`,
        project: project._id,
        link: `/project/${project._id}`,
      });
    }
  }

  return review;
};

// Assign / change the faculty reviewer (project owner or team leader only).
export const assignFaculty = async ({ projectId, facultyId, requester }) => {
  const { isProjectManager } = await import("../utils/projectAccess.js");
  const project = await projectService.getProjectById(projectId);

  if (!(await isProjectManager(project, requester._id))) {
    const error = new Error("Only the team leader or project owner can assign a faculty reviewer");
    error.status = 403;
    throw error;
  }

  const { default: User } = await import("../models/User.js");
  const faculty = await User.findById(facultyId);
  if (!faculty || faculty.role !== "faculty") {
    const error = new Error("Selected user is not a faculty member");
    error.status = 400;
    throw error;
  }

  project.assignedFaculty = facultyId;
  await project.save();
  return projectService.getProjectById(projectId);
};