import * as milestoneService from "../services/milestoneService.js";
import * as projectService from "../services/projectService.js";
import { isProjectMember, isProjectManager } from "../utils/projectAccess.js";

export const getMilestones = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectMember(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Not authorized to view this project's milestones" });
    }

    const milestones = await milestoneService.getMilestonesByProject(req.params.projectId);
    res.status(200).json({ success: true, milestones });
  } catch (error) {
    next(error);
  }
};

export const createMilestone = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectManager(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Only the team leader or project owner can create milestones" });
    }

    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: "Milestone title is required" });
    }

    const milestone = await milestoneService.createMilestone({
      title: req.body.title,
      description: req.body.description || "",
      deadline: req.body.deadline || null,
      status: req.body.status || "Pending",
      project: req.params.projectId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, milestone });
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectManager(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Only the team leader or project owner can update milestones" });
    }

    const existing = await milestoneService.getMilestoneById(req.params.milestoneId);
    if (String(existing.project._id || existing.project) !== String(project._id)) {
      return res.status(400).json({ success: false, message: "Milestone does not belong to this project" });
    }

    const milestone = await milestoneService.updateMilestone(req.params.milestoneId, req.body);
    res.status(200).json({ success: true, milestone });
  } catch (error) {
    next(error);
  }
};

export const deleteMilestone = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectManager(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Only the team leader or project owner can delete milestones" });
    }

    const existing = await milestoneService.getMilestoneById(req.params.milestoneId);
    if (String(existing.project._id || existing.project) !== String(project._id)) {
      return res.status(400).json({ success: false, message: "Milestone does not belong to this project" });
    }

    const milestone = await milestoneService.deleteMilestone(req.params.milestoneId);
    res.status(200).json({ success: true, message: "Milestone deleted", milestone });
  } catch (error) {
    next(error);
  }
};