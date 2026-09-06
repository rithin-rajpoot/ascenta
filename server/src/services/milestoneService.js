import Milestone from "../models/Milestone.js";

export const getMilestonesByProject = async (projectId) => {
  return Milestone.find({ project: projectId })
    .populate("createdBy", "name")
    .sort("order createdAt");
};

export const getMilestoneById = async (milestoneId) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    const error = new Error("Milestone not found");
    error.status = 404;
    throw error;
  }
  return milestone;
};

export const createMilestone = async (data) => {
  // New milestones are appended after the highest existing order.
  const highest = await Milestone.findOne({ project: data.project }).sort("-order");
  const order = highest ? highest.order + 1 : 0;
  return Milestone.create({ ...data, order });
};

export const updateMilestone = async (milestoneId, data) => {
  const milestone = await Milestone.findByIdAndUpdate(milestoneId, data, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name");

  if (!milestone) {
    const error = new Error("Milestone not found");
    error.status = 404;
    throw error;
  }
  return milestone;
};

export const deleteMilestone = async (milestoneId) => {
  const milestone = await Milestone.findByIdAndDelete(milestoneId);
  if (!milestone) {
    const error = new Error("Milestone not found");
    error.status = 404;
    throw error;
  }
  return milestone;
};