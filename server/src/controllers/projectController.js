import * as projectService from "../services/projectService.js";
import Team from "../models/Team.js";
import { isProjectMember } from "../utils/projectAccess.js";

export const createProjectController = async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user._id };
    
    // If team is provided, verify user is in that team
    if (data.team) {
      const team = await Team.findById(data.team);
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
      const userIdStr = String(req.user._id);
      const isLeader = String(team.leader) === userIdStr;
      const isMember = team.members.some((m) => String(m) === userIdStr);
      if (!isLeader && !isMember) {
        return res.status(403).json({ success: false, message: "Not a member of this team" });
      }
    }

    const project = await projectService.createProject(data);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const getTeamProjectsController = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const userIdStr = String(req.user._id);
    const isLeader = String(team.leader) === userIdStr;
    const isMember = team.members.some((m) => String(m) === userIdStr);
    if (!isLeader && !isMember) {
      return res.status(403).json({ success: false, message: "Not a member of this team" });
    }

    const projects = await projectService.getProjectsByTeam(req.params.teamId);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectController = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    
    // Check authorization
    const isAuthorized = await isProjectMember(project, req.user._id);
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
    const isAuthorized = await isProjectMember(existingProject, req.user._id);
    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this project" });
    }

    const project = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};
