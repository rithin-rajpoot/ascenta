import * as dashboardService from "../services/dashboardService.js";

export const getStudentDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getStudentDashboard(req.user._id);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};