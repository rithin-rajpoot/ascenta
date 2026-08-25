import {
  createTeam,
  getTeam,
  inviteMember,
  joinTeam,
  removeMember,
  getUserTeams,
} from "../services/teamService.js";

export const createTeamController = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const team = await createTeam({ name: name.trim(), userId: req.user._id });
    res.status(201).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

export const getTeamController = async (req, res, next) => {
  try {
    const team = await getTeam(req.params.id);
    res.status(200).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

export const getUserTeamsController = async (req, res, next) => {
  try {
    const teams = await getUserTeams(req.user._id);
    res.status(200).json({ success: true, teams });
  } catch (error) {
    next(error);
  }
};

export const inviteMemberController = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const team = await inviteMember({
      teamId: req.params.id,
      userId,
      leaderId: req.user._id,
    });
    res.status(200).json({ success: true, message: "Member invited", team });
  } catch (error) {
    next(error);
  }
};

export const joinTeamController = async (req, res, next) => {
  try {
    const team = await joinTeam({
      teamId: req.params.id,
      userId: req.user._id,
    });
    res.status(200).json({ success: true, message: "Joined team", team });
  } catch (error) {
    next(error);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const team = await removeMember({
      teamId: req.params.id,
      userId: req.params.userId,
      leaderId: req.user._id,
    });
    res.status(200).json({ success: true, message: "Member removed", team });
  } catch (error) {
    next(error);
  }
};