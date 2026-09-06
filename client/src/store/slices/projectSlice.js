import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectService from "../../services/projectService";

const initialState = {
  currentProject: null,
  teamProjects: [],
  isLoading: false,
  error: null,
};

export const createProject = createAsyncThunk(
  "project/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await projectService.createProject(data);
      return res.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create project");
    }
  }
);

export const getProject = createAsyncThunk(
  "project/get",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await projectService.getProject(projectId);
      return res.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load project");
    }
  }
);

export const getTeamProjects = createAsyncThunk(
  "project/getTeamProjects",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await projectService.getTeamProjects(teamId);
      return res.projects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load team projects");
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/update",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await projectService.updateProject(projectId, data);
      return res.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update project");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProject: (state) => {
      state.currentProject = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get
      .addCase(getProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Team Projects
      .addCase(getTeamProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamProjects = action.payload;
      })
      .addCase(getTeamProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
