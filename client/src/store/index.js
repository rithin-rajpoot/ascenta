import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import teamReducer from "./slices/teamSlice.js";
import projectReducer from "./slices/projectSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    project: projectReducer,
  },
});

export default store;