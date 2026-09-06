import * as taskService from "../services/taskService.js";
import * as projectService from "../services/projectService.js";
import { isProjectMember, isProjectManager } from "../utils/projectAccess.js";
import Team from "../models/Team.js";

const VALID_STATUSES = ["Todo", "In Progress", "Review", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

// Load the project's team (full doc) so we can validate assignments.
const getProjectTeam = async (project) => {
  if (!project.team) return null;
  return Team.findById(project.team._id || project.team);
};

// Verify the assignee is a project owner, team leader, or team member.
const isProjectUser = (project, team, assigneeId) => {
  if (!assigneeId) return true;
  const assigneeStr = String(assigneeId);
  if (project.owner && String(project.owner._id || project.owner) === assigneeStr) {
    return true;
  }
  if (team) {
    if (String(team.leader) === assigneeStr) return true;
    if (team.members.some((m) => String(m) === assigneeStr)) return true;
  }
  return false;
};

export const getTasks = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectMember(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Not authorized to view this project's tasks" });
    }

    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectManager(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Only the team leader or project owner can create tasks" });
    }

    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }
    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const team = await getProjectTeam(project);
    if (!isProjectUser(project, team, req.body.assignedTo || null)) {
      return res.status(400).json({ success: false, message: "Tasks can only be assigned to project team members" });
    }

    const task = await taskService.createTask({
      title: req.body.title,
      description: req.body.description || "",
      assignedTo: req.body.assignedTo || null,
      priority: req.body.priority || "Medium",
      dueDate: req.body.dueDate || null,
      status: req.body.status || "Todo",
      project: req.params.projectId,
      createdBy: req.user._id,
    });

    const populated = await taskService.updateTask(task._id, {});
    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};
export const updateTask = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);
    const existing = await taskService.getTaskById(req.params.taskId);

    if (String(existing.project._id || existing.project) !== String(project._id)) {
      return res.status(400).json({ success: false, message: "Task does not belong to this project" });
    }

    const isManager = await isProjectManager(project, req.user._id);

    if (!isManager) {
      // Regular team members may only update the status of tasks assigned to them.
      const isAssignee =
        existing.assignedTo && String(existing.assignedTo) === String(req.user._id);
      const bodyKeys = Object.keys(req.body);
      const statusOnly =
        bodyKeys.length > 0 &&
        bodyKeys.every((k) => k === "status") &&
        VALID_STATUSES.includes(req.body.status);

      if (!isAssignee || !statusOnly) {
        return res.status(403).json({ success: false, message: "You can only update the status of tasks assigned to you" });
      }
      await taskService.updateTask(req.params.taskId, { status: req.body.status });
      const populated = await taskService.updateTask(req.params.taskId, {});
      return res.status(200).json({ success: true, task: populated });
    }

    if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }
    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const data = {};
    const editable = ["title", "description", "assignedTo", "priority", "dueDate", "status"];
    for (const key of editable) {
      if (key in req.body) data[key] = req.body[key];
    }

    const team = await getProjectTeam(project);
    const assignee = data.assignedTo === undefined ? existing.assignedTo : data.assignedTo;
    if (!isProjectUser(project, team, assignee)) {
      return res.status(400).json({ success: false, message: "Tasks can only be assigned to project team members" });
    }

    const task = await taskService.updateTask(req.params.taskId, data);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!(await isProjectManager(project, req.user._id))) {
      return res.status(403).json({ success: false, message: "Only the team leader or project owner can delete tasks" });
    }

    const existing = await taskService.getTaskById(req.params.taskId);
    if (String(existing.project._id || existing.project) !== String(project._id)) {
      return res.status(400).json({ success: false, message: "Task does not belong to this project" });
    }

    await taskService.deleteTask(req.params.taskId);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};