import Project from "../models/Project.js";
import Team from "../models/Team.js";

export const createProject = async (data) => {
  if (data.team) {
    const team = await Team.findById(data.team);
    if (!team) {
      const error = new Error("Team not found");
      error.status = 404;
      throw error;
    }
  }

  const project = await Project.create(data);
  return project;
};

export const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId).populate("owner", "name email").populate("team", "name");
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
};

export const updateProject = async (projectId, data) => {
  const project = await Project.findByIdAndUpdate(projectId, data, {
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
