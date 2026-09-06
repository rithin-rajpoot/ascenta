import api from "./api";

export const generateProjectIdeas = async (data) => {
  const { data: res } = await api.post("/ai/project-ideas", data);
  return res;
};

export const generateProjectFeatures = async (data) => {
  const { data: res } = await api.post("/ai/project-features", data);
  return res;
};

export const generateProjectSdgs = async (data) => {
  const { data: res } = await api.post("/ai/project-sdgs", data);
  return res;
};

export const generateProjectBlueprint = async (data) => {
  const { data: res } = await api.post("/ai/project-blueprint", data);
  return res;
};
