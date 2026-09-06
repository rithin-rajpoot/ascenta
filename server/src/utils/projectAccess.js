import Team from "../models/Team.js";

// Whether the user can view a project (owner, team leader, or team member).
export const isProjectMember = async (project, userId) => {
  const userIdStr = String(userId);

  if (project.owner && String(project.owner._id || project.owner) === userIdStr) {
    return true;
  }

  if (project.team) {
    const team = await Team.findById(project.team._id || project.team);
    if (team) {
      const isLeader = String(team.leader) === userIdStr;
      const isMember = team.members.some((m) => String(m) === userIdStr);
      if (isLeader || isMember) {
        return true;
      }
    }
  }

  return false;
};

// Whether the user can manage a project's planning data (owner or team leader).
// Regular team members are intentionally excluded (see RULES.md — team leaders
// own milestone/task management).
export const isProjectManager = async (project, userId) => {
  const userIdStr = String(userId);

  if (project.owner && String(project.owner._id || project.owner) === userIdStr) {
    return true;
  }

  if (project.team) {
    const team = await Team.findById(project.team._id || project.team);
    if (team && String(team.leader) === userIdStr) {
      return true;
    }
  }

  return false;
};

export default { isProjectMember, isProjectManager };