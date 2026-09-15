import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as facultyService from "../../services/facultyService";

const initialState = {
  facultyList: [],
  assignedProjects: [],
  currentFacultyProject: null, // { project, milestones, tasks, reviews }
  reviews: [],
  isLoading: false,
  error: null,
};

export const getFacultyList = createAsyncThunk("faculty/getList", async (_, { rejectWithValue }) => {
  try {
    const res = await facultyService.getFacultyList();
    return res.faculty;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load faculty list");
  }
});

export const getAssignedProjects = createAsyncThunk(
  "faculty/getAssignedProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await facultyService.getAssignedProjects();
      return res.projects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load assigned projects");
    }
  }
);

export const getFacultyProjectDetail = createAsyncThunk(
  "faculty/getProjectDetail",
  async (projectId, { rejectWithValue }) => {
    try {
      return await facultyService.getFacultyProjectDetail(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load project");
    }
  }
);

export const getProjectReviews = createAsyncThunk(
  "faculty/getReviews",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await facultyService.getProjectReviews(projectId);
      return res.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load feedback");
    }
  }
);

export const submitReview = createAsyncThunk(
  "faculty/submitReview",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await facultyService.submitReview(projectId, data);
      return res.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);

export const assignFaculty = createAsyncThunk(
  "faculty/assign",
  async ({ projectId, facultyId }, { rejectWithValue }) => {
    try {
      const res = await facultyService.assignFaculty(projectId, facultyId);
      return res.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign faculty");
    }
  }
);

const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    clearFacultyProject: (state) => {
      state.currentFacultyProject = null;
      state.reviews = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFacultyList.fulfilled, (state, action) => {
        state.facultyList = action.payload;
      })
      .addCase(getFacultyList.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Assigned projects
      .addCase(getAssignedProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAssignedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignedProjects = action.payload;
      })
      .addCase(getAssignedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Project detail
      .addCase(getFacultyProjectDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFacultyProjectDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFacultyProject = action.payload;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(getFacultyProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reviews
      .addCase(getProjectReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(getProjectReviews.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(submitReview.pending, (state) => {
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Assign faculty (updates the student-side currentProject too, if present)
      .addCase(assignFaculty.pending, (state) => {
        state.error = null;
      })
      .addCase(assignFaculty.fulfilled, (state, action) => {
        const updated = action.payload;
        state.assignedProjects = state.assignedProjects.filter(
          (p) => String(p._id) !== String(updated._id)
        );
      })
      .addCase(assignFaculty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFacultyProject, clearError } = facultySlice.actions;
export default facultySlice.reducer;