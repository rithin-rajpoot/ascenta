import api from "./api";

export const createTeam = async (data) => {
  const { data: res } = await api.post("/teams", data);
  return res;
};

export const getTeam = async (teamId) => {
  const { data } = await api.get(`/teams/${teamId}`);
  return data;
};

export const inviteMember = async (teamId, userId) => {
  const { data } = await api.post(`/teams/${teamId}/invite`, { userId });
  return data;
};

export const joinTeam = async (teamId) => {
  const { data } = await api.post(`/teams/${teamId}/join`);
  return data;
};

export const removeMember = async (teamId, userId) => {
  const { data } = await api.delete(`/teams/${teamId}/members/${userId}`);
  return data;
};

export const getMyTeams = async () => {
  const { data } = await api.get("/teams/my-teams");
  return data;
};