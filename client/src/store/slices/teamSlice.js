import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as teamService from "../../services/teamService";

const initialState = {
  team: null,
  myTeams: [],
  isLoading: false,
  error: null,
};

export const createTeam = createAsyncThunk(
  "team/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await teamService.createTeam(data);
      return res.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create team");
    }
  }
);

export const getTeam = createAsyncThunk(
  "team/get",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await teamService.getTeam(teamId);
      return res.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load team");
    }
  }
);

export const inviteMember = createAsyncThunk(
  "team/invite",
  async ({ teamId, userId }, { rejectWithValue }) => {
    try {
      const res = await teamService.inviteMember(teamId, userId);
      return res.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to invite member");
    }
  }
);

export const joinTeam = createAsyncThunk(
  "team/join",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await teamService.joinTeam(teamId);
      return res.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to join team");
    }
  }
);

export const removeMember = createAsyncThunk(
  "team/removeMember",
  async ({ teamId, userId }, { rejectWithValue }) => {
    try {
      const res = await teamService.removeMember(teamId, userId);
      return res.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove member");
    }
  }
);

export const getMyTeams = createAsyncThunk(
  "team/getMyTeams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await teamService.getMyTeams();
      return res.teams;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load teams");
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeam: (state) => {
      state.team = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.team = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get
      .addCase(getTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.team = action.payload;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Invite
      .addCase(inviteMember.fulfilled, (state, action) => {
        state.team = action.payload;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Join
      .addCase(joinTeam.fulfilled, (state, action) => {
        state.team = action.payload;
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove
      .addCase(removeMember.fulfilled, (state, action) => {
        state.team = action.payload;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get My Teams
      .addCase(getMyTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTeams = action.payload;
      })
      .addCase(getMyTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeam, clearError } = teamSlice.actions;
export default teamSlice.reducer;