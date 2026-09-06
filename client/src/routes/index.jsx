import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import TeamSetupPage from "../pages/team/TeamSetupPage";
import CreateTeamPage from "../pages/team/CreateTeamPage";
import JoinTeamPage from "../pages/team/JoinTeamPage";
import TeamDetailsPage from "../pages/team/TeamDetailsPage";
import MyTeamsPage from "../pages/team/MyTeamsPage";
import ProjectSetupPage from "../pages/project/ProjectSetupPage";
import ProjectIdeasPage from "../pages/project/ProjectIdeasPage";
import ProjectBlueprintPage from "../pages/project/ProjectBlueprintPage";
import ProjectOverviewPage from "../pages/project/ProjectOverviewPage";
import ProjectMilestonesPage from "../pages/project/ProjectMilestonesPage";
import ProjectTasksPage from "../pages/project/ProjectTasksPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/setup"
          element={
            <ProtectedRoute roles={["student"]}>
              <TeamSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyTeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/create"
          element={
            <ProtectedRoute roles={["student"]}>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/join"
          element={
            <ProtectedRoute roles={["student"]}>
              <JoinTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:id"
          element={
            <ProtectedRoute>
              <TeamDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/setup"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/ideas"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectIdeasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/blueprint"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectBlueprintPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/milestones"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectMilestonesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/tasks"
          element={
            <ProtectedRoute roles={["student"]}>
              <ProjectTasksPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;