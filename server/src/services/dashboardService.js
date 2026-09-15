import Project from "../models/Project.js";
import Team from "../models/Team.js";
import Milestone from "../models/Milestone.js";
import Task from "../models/Task.js";
import FacultyReview from "../models/FacultyReview.js";

// Compute progress metrics for a set of project ids.
const computeProgress = (projectIds) => {
  const stats = {};
  for (const id of projectIds.map(String)) {
    stats[id] = {
      milestonesTotal: 0,
      milestonesCompleted: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      tasksPending: 0,
      myTasks: 0,
      nextDeadline: null,
    };
  }

  return Promise.all([
    Milestone.find({ project: { $in: projectIds } }).sort("deadline"),
    Task.find({ project: { $in: projectIds } }),
  ]).then(([milestones, tasks]) => {
    for (const m of milestones) {
      const s = stats[String(m.project)];
      if (!s) continue;
      s.milestonesTotal += 1;
      if (m.status === "Completed") s.milestonesCompleted += 1;
      if (m.deadline && m.status !== "Completed") {
        const due = new Date(m.deadline);
        if (!s.nextDeadline || due < new Date(s.nextDeadline)) {
          s.nextDeadline = m.deadline;
        }
      }
    }
    for (const t of tasks) {
      const s = stats[String(t.project)];
      if (!s) continue;
      s.tasksTotal += 1;
      if (t.status === "Completed") s.tasksCompleted += 1;
      else s.tasksPending += 1;
    }
    return stats;
  });
};

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

// Aggregated dashboard for a student.
export const getStudentDashboard = async (userId) => {
  const teams = await Team.find({ $or: [{ leader: userId }, { members: userId }] }).select("_id");
  const teamIds = teams.map((t) => t._id);

  const projects = await Project.find({
    $or: [{ owner: userId }, { team: { $in: teamIds } }],
  })
    .populate("owner", "name email")
    .populate({
      path: "team",
      select: "name leader members",
      populate: { path: "leader members", select: "name email" },
    })
    .sort("-createdAt");

  const projectIds = projects.map((p) => p._id);
  const [stats, reviews] = await Promise.all([
    computeProgress(projectIds),
    FacultyReview.find({ project: { $in: projectIds } })
      .sort("-createdAt")
      .limit(5)
      .populate("faculty", "name")
      .populate("project", "title"),
  ]);

  const projectCards = projects.map((p) => {
    const s = stats[String(p._id)];
    return {
      project: p,
      ...s,
      myTasks: s.tasksTotal, // refined below
      progressPct: pct(s.milestonesCompleted + s.tasksCompleted, s.milestonesTotal + s.tasksTotal),
    };
  });

  // Count tasks pending & assigned to me specifically.
  const myTasksByProject = {};
  const myTasks = await Task.find({
    assignedTo: userId,
    project: { $in: projectIds },
    status: { $ne: "Completed" },
  });
  for (const t of myTasks) {
    myTasksByProject[String(t.project)] = (myTasksByProject[String(t.project)] || 0) + 1;
  }
  for (const card of projectCards) {
    card.myTasks = myTasksByProject[String(card.project._id)] || 0;
  }

  const totals = projectCards.reduce(
    (acc, c) => ({
      tasksPending: acc.tasksPending + c.tasksPending,
      milestonesCompleted: acc.milestonesCompleted + c.milestonesCompleted,
      progressPct: acc.progressPct + c.progressPct,
    }),
    { tasksPending: 0, milestonesCompleted: 0, progressPct: 0 }
  );

  return {
    projects: projectCards,
    recentFeedback: reviews,
    stats: {
      activeProjects: projectCards.filter((c) => c.project.status !== "Completed").length,
      totalProjects: projectCards.length,
      tasksPending: totals.tasksPending,
      milestonesCompleted: totals.milestonesCompleted,
      overallPct: projectCards.length ? Math.round(totals.progressPct / projectCards.length) : 0,
    },
  };
};

// Aggregated dashboard for a faculty member (their assigned projects).
export const getFacultyDashboard = async (facultyId) => {
  const projects = await Project.find({ assignedFaculty: facultyId })
    .populate("owner", "name email")
    .populate({
      path: "team",
      select: "name leader members",
      populate: { path: "leader members", select: "name email" },
    })
    .sort("-createdAt");

  const stats = await computeProgress(projects.map((p) => p._id));

  const reviews = await FacultyReview.find({ project: { $in: projects.map((p) => p._id) } })
    .sort("-createdAt");

  const feedbackCounts = {};
  const lastFeedbackAt = {};
  for (const r of reviews) {
    const key = String(r.project);
    feedbackCounts[key] = (feedbackCounts[key] || 0) + 1;
    if (!lastFeedbackAt[key] || r.createdAt > lastFeedbackAt[key]) {
      lastFeedbackAt[key] = r.createdAt;
    }
  }

  const projectCards = projects.map((p) => {
    const s = stats[String(p._id)];
    return {
      project: p,
      ...s,
      feedbackCount: feedbackCounts[String(p._id)] || 0,
      lastFeedbackAt: lastFeedbackAt[String(p._id)] || null,
      progressPct: pct(s.milestonesCompleted + s.tasksCompleted, s.milestonesTotal + s.tasksTotal),
    };
  });

  return {
    projects: projectCards,
    stats: {
      assignedProjects: projectCards.length,
      totalMilestonesCompleted: projectCards.reduce((a, c) => a + c.milestonesCompleted, 0),
      totalTasksPending: projectCards.reduce((a, c) => a + c.tasksPending, 0),
      totalFeedback: reviews.length,
    },
  };
};