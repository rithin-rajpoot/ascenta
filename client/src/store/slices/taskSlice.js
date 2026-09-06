import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as taskService from "../../services/taskService";

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await taskService.getTasks(projectId);
      return res.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await taskService.createTask(projectId, data);
      return res.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ projectId, taskId, data }, { rejectWithValue }) => {
    try {
      const res = await taskService.updateTask(projectId, taskId, data);
      return res.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(projectId, taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = [...state.tasks, action.payload];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          String(t._id) === String(action.payload._id) ? action.payload : t
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => String(t._id) !== String(action.payload));
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTasks, clearError } = taskSlice.actions;
export default taskSlice.reducer;