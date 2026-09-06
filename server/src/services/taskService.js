import Task from "../models/Task.js";

export const getTasksByProject = async (projectId) => {
  return Task.find({ project: projectId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name")
    .sort("createdAt");
};

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
  return task;
};

export const createTask = async (data) => {
  return Task.create(data);
};

export const updateTask = async (taskId, data) => {
  const task = await Task.findByIdAndUpdate(taskId, data, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
  return task;
};

export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
  return task;
};