import * as projectService from "../services/projectService.js";
import Team from "../models/Team.js";

// Helper to check authorization
const authorizeProjectAccess = async (project, userId) => {
  if (project.owner._id.toString() === userId) {
    return true;
  }
  if (project.team) {
    const team = await Team.findById(project.team._id || project.team);
    if (team && (team.leader.toString() === userId || team.members.includes(userId))) {
      return true;
    }
  }
  return false;
};

export const createProjectController = async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user._id };
    
    // If team is provided, verify user is in that team
    if (data.team) {
      const team = await Team.findById(data.team);
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
      if (team.leader.toString() !== req.user._id && !team.members.includes(req.user._id)) {
        return res.status(403).json({ success: false, message: "Not a member of this team" });
      }
    }

    const project = await projectService.createProject(data);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const getProjectController = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    
    // Check authorization
    const isAuthorized = await authorizeProjectAccess(project, req.user._id);
    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (req, res, next) => {
  try {
    const existingProject = await projectService.getProjectById(req.params.id);
    
    // Check authorization
    const isAuthorized = await authorizeProjectAccess(existingProject, req.user._id);
    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this project" });
    }

    const project = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};
