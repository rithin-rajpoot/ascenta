import api from "./api";

// --- Faculty Review Portal ---

export const getFacultyList = async () => {
  const { data } = await api.get("/faculty");
  return data;
};

export const getAssignedProjects = async () => {
  const { data } = await api.get("/faculty/projects");
  return data;
};

export const getFacultyProjectDetail = async (projectId) => {
  const { data } = await api.get(`/faculty/projects/${projectId}`);
  return data;
};

export const getProjectReviews = async (projectId) => {
  const { data } = await api.get(`/faculty/projects/${projectId}/reviews`);
  return data;
};

export const submitReview = async (projectId, data) => {
  const { data: res } = await api.post(`/faculty/projects/${projectId}/reviews`, data);
  return res;
};

export const assignFaculty = async (projectId, facultyId) => {
  const { data: res } = await api.post(`/faculty/projects/${projectId}/assign`, { facultyId });
  return res;
};