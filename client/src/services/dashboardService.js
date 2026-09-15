import api from "./api";

// --- Dashboards (Phase 11) ---

export const getStudentDashboard = async () => {
  const { data } = await api.get("/dashboard/student");
  return data;
};

export const getFacultyDashboard = async () => {
  const { data } = await api.get("/faculty/dashboard");
  return data;
};