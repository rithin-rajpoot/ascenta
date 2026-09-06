import Team from "../models/Team.js";
import User from "../models/User.js";
import { generateInviteCode } from "../utils/generateInviteCode.js";

/**
 * Generate a guaranteed-unique invite code for a team.
 */
const generateUniqueInviteCode = async () => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateInviteCode();
    const existing = await Team.findOne({ inviteCode: code });
    if (!existing) return code;
  }
  // Extremely unlikely fallback: add a timestamp suffix to avoid collisions.
  return `${generateInviteCode()}-${Date.now().toString(36).toUpperCase()}`;
};

/**
 * Create a new team. The creator becomes leader and first member.
 */
export const createTeam = async ({ name, userId }) => {
  const inviteCode = await generateUniqueInviteCode();
  const team = await Team.create({
    name,
    leader: userId,
    members: [userId],
    inviteCode,
  });

  return team;
};

/**
 * Ensure an existing team that predates invite codes has one generated.
 */
const ensureInviteCode = async (team) => {
  if (!team.inviteCode) {
    team.inviteCode = await generateUniqueInviteCode();
    await team.save();
  }
  return team;
};

/**
 * Backfill the invite code and populate leader/members so a returned team is
 * always fully populated. Note document `.populate()` returns a Promise, so each
 * call must be awaited separately (they cannot be chained like queries).
 */
const loadTeamRefs = async (team) => {
  team = await ensureInviteCode(team);
  await team.populate("leader", "name email");
  await team.populate("members", "name email");
  return team;
};

/**
 * Get team details with populated leader and members.
 */
export const getTeam = async (teamId) => {
  let team = await Team.findById(teamId)
    .populate("leader", "name email")
    .populate("members", "name email");

  if (!team) {
    const error = new Error("Team not found");
    error.status = 404;
    throw error;
  }

  team = await ensureInviteCode(team);
  return team;
}

/**
 * Get all teams the user belongs to or leads.
 */
export const getUserTeams = async (userId) => {
  let teams = await Team.find({
    $or: [{ leader: userId }, { members: userId }],
  })
    .populate("leader", "name email")
    .populate("members", "name email");

  // Backfill codes for any legacy teams.
  teams = await Promise.all(teams.map((team) => ensureInviteCode(team)));
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
  return loadTeamRefs(team);
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
  return loadTeamRefs(team);
}

/**
 * Join a team using its human-friendly invite code.
 */
export const joinTeamByCode = async ({ inviteCode, userId }) => {
  const normalized = inviteCode.trim().toUpperCase();

  let team = await Team.findOne({ inviteCode: normalized });
  if (!team) {
    const error = new Error("Invalid invite code. No team found with that code.");
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
  return loadTeamRefs(team);
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
  return loadTeamRefs(team);
}