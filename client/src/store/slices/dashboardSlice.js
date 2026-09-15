import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dashboardService from "../../services/dashboardService";

const initialState = {
  student: null, // { projects, recentFeedback, stats }
  faculty: null, // { projects, stats }
  isLoading: false,
  error: null,
};

export const fetchStudentDashboard = createAsyncThunk(
  "dashboard/fetchStudent",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getStudentDashboard();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
    }
  }
);

export const fetchFacultyDashboard = createAsyncThunk(
  "dashboard/fetchFaculty",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getFacultyDashboard();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFacultyDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faculty = action.payload;
      })
      .addCase(fetchFacultyDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;