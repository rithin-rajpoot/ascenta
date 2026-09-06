import api from "./api";

export const createProject = async (data) => {
  const { data: res } = await api.post("/projects", data);
  return res;
};

export const getProject = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

export const getTeamProjects = async (teamId) => {
  const { data } = await api.get(`/projects/team/${teamId}`);
  return data;
};

export const updateProject = async (projectId, data) => {
  const { data: res } = await api.put(`/projects/${projectId}`, data);
  return res;
};

// --- Milestones ---

export const getMilestones = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/milestones`);
  return data;
};

export const createMilestone = async (projectId, data) => {
  const { data: res } = await api.post(`/projects/${projectId}/milestones`, data);
  return res;
};

export const updateMilestone = async (projectId, milestoneId, data) => {
  const { data: res } = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, data);
  return res;
};

export const deleteMilestone = async (projectId, milestoneId) => {
  const { data: res } = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
  return res;
};
