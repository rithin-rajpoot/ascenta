import Project from "../models/Project.js";
import Team from "../models/Team.js";
import Milestone from "../models/Milestone.js";
import Task from "../models/Task.js";
import FacultyReview from "../models/FacultyReview.js";
import Notification from "../models/Notification.js";
import normalizeProjectData from "../utils/normalizeProjectData.js";

export const createProject = async (data) => {
  if (data.team) {
    const team = await Team.findById(data.team);
    if (!team) {
      const error = new Error("Team not found");
      error.status = 404;
      throw error;
    }
  }

  const project = await Project.create(normalizeProjectData(data));
  return project;
};

export const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate("owner", "name email")
    .populate("assignedFaculty", "name email")
    .populate({
      path: "team",
      select: "name leader members",
      populate: { path: "leader members", select: "name email" },
    });
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
};

export const getProjectsByTeam = async (teamId) => {
  return Project.find({ team: teamId })
    .populate("owner", "name email")
    .populate("team", "name")
    .sort("-createdAt");
};

export const updateProject = async (projectId, data) => {
  const project = await Project.findByIdAndUpdate(projectId, normalizeProjectData(data), {
    new: true,
    runValidators: true,
  }).populate("owner", "name email").populate("team", "name");
  
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
};

export const deleteProject = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  // Cascade-delete everything tied to the project so no orphaned planning
  // data outlives it: milestones, tasks, faculty reviews and notifications
  // that deep-link to the project.
  await Promise.all([
    Milestone.deleteMany({ project: projectId }),
    Task.deleteMany({ project: projectId }),
    FacultyReview.deleteMany({ project: projectId }),
    Notification.deleteMany({ project: projectId }),
  ]);
  await Project.deleteOne({ _id: projectId });
};
