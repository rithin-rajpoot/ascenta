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

// AI Technical Assistant (Phase 8)
export const askAssistant = async ({ question, history, context }) => {
  const { data: res } = await api.post("/ai/assistant", { question, history, context });
  return res;
};
