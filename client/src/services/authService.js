import api from "./api";

export const register = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};