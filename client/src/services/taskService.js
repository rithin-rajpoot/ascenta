import api from "./api";

// --- Tasks ---

export const getTasks = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

export const createTask = async (projectId, data) => {
  const { data: res } = await api.post(`/projects/${projectId}/tasks`, data);
  return res;
};

export const updateTask = async (projectId, taskId, data) => {
  const { data: res } = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
  return res;
};

export const deleteTask = async (projectId, taskId) => {
  const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  return data;
};