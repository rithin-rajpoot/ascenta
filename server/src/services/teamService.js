import Team from "../models/Team.js";
import User from "../models/User.js";

/**
 * Create a new team. The creator becomes leader and first member.
 */
export const createTeam = async ({ name, userId }) => {
  const team = await Team.create({
    name,
    leader: userId,
    members: [userId],
  });

  return team;
};

/**
 * Get team details with populated leader and members.
 */
export const getTeam = async (teamId) => {
  const team = await Team.findById(teamId)
    .populate("leader", "name email")
    .populate("members", "name email");

  if (!team) {
    const error = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  return team;
}

/**
 * Get all teams the user belongs to or leads.
 */
export const getUserTeams = async (userId) => {
  const teams = await Team.find({
    $or: [{ leader: userId }, { members: userId }],
  })
    .populate("leader", "name email")
    .populate("members", "name email");
  return teams;
};

/**
 * Invite a student to the team (leader only).
 */
export const inviteMember = async ({ teamId, userId, leaderId }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    const error = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  if (team.leader.toString() !== leaderId.toString()) {
    const error = new Error("Only the team leader can invite members");
    error.status = 403;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "student") {
    const error = new Error("Only students can be invited to a team");
    error.status = 400;
    throw error;
  }

  if (team.members.some((m) => m.toString() === userId.toString())) {
    const error = new Error("User is already a member of this team");
    error.status = 400;
    throw error;
  }

  team.members.push(userId);
  await team.save();
  return team;
}

/**
 * Join a team as a student.
 */
export const joinTeam = async ({ teamId, userId }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    const error = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  if (team.members.some((m) => m.toString() === userId.toString())) {
    const error = new Error("You are already a member of this team");
    error.status = 400;
    throw error;
  }

  team.members.push(userId);
  await team.save();
  return team;
}

/**
 * Remove a member from a team (leader only, cannot remove self).
 */
export const removeMember = async ({ teamId, userId, leaderId }) => {
  const team = await Team.findById(teamId);
  if (!team) {
    const error = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  if (team.leader.toString() !== leaderId.toString()) {
    const error = new Error("Only the team leader can remove members");
    error.status = 403;
    throw error;
  }

  if (team.leader.toString() === userId.toString()) {
    const error = new Error("The team leader cannot remove themselves");
    error.status = 400;
    throw error;
  }

  if (!team.members.some((m) => m.toString() === userId.toString())) {
    const error = new Error("User is not a member of this team");
    error.status = 400;
    throw error;
  }

  team.members = team.members.filter((m) => m.toString() !== userId.toString());
  await team.save();
  return team;
}