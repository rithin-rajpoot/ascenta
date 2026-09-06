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
