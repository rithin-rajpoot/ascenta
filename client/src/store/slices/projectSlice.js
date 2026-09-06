import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectService from "../../services/projectService";

const initialState = {
  currentProject: null,
  teamProjects: [],
  milestones: [],
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

// --- Milestones ---

export const getMilestones = createAsyncThunk(
  "project/getMilestones",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await projectService.getMilestones(projectId);
      return res.milestones;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load milestones");
    }
  }
);

export const createMilestone = createAsyncThunk(
  "project/createMilestone",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await projectService.createMilestone(projectId, data);
      return res.milestone;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create milestone");
    }
  }
);

export const updateMilestone = createAsyncThunk(
  "project/updateMilestone",
  async ({ projectId, milestoneId, data }, { rejectWithValue }) => {
    try {
      const res = await projectService.updateMilestone(projectId, milestoneId, data);
      return res.milestone;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update milestone");
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  "project/deleteMilestone",
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      await projectService.deleteMilestone(projectId, milestoneId);
      return milestoneId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete milestone");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProject: (state) => {
      state.currentProject = null;
      state.milestones = [];
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
      })
      // Get Milestones
      .addCase(getMilestones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMilestones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = action.payload;
      })
      .addCase(getMilestones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Milestone
      .addCase(createMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = [...state.milestones, action.payload];
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Milestone
      .addCase(updateMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = state.milestones.map((m) =>
          String(m._id) === String(action.payload._id) ? action.payload : m
        );
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Milestone
      .addCase(deleteMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = state.milestones.filter(
          (m) => String(m._id) !== String(action.payload)
        );
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
