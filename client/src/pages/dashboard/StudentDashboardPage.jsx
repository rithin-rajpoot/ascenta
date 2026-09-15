import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FolderKanban,
  ListChecks,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { fetchStudentDashboard } from "../../store/slices/dashboardSlice";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

function StudentDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { student, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  if (isLoading && !student) {
    return <PageLoader label="Loading your dashboard…" />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  const { projects = [], recentFeedback = [], stats } = student || {};

  const statCards = [
    {
      icon: FolderKanban,
      label: "Active Projects",
      value: stats?.activeProjects ?? 0,
      sub: `${stats?.totalProjects ?? 0} total`,
    },
    {
      icon: Clock,
      label: "Pending Tasks",
      value: stats?.tasksPending ?? 0,
      sub: "across all projects",
    },
    {
      icon: ListChecks,
      label: "Milestones Done",
      value: stats?.milestonesCompleted ?? 0,
      sub: "all time",
    },
    {
      icon: TrendingUp,
      label: "Overall Progress",
      value: `${stats?.overallPct ?? 0}%`,
      sub: "average",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of your projects and progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <card.icon size={20} className="text-primary" />
            <p className="mt-3 text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-sm font-medium text-text-secondary">{card.label}</p>
            <p className="text-xs text-text-muted">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Projects with progress */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
          <FolderKanban size={18} className="text-primary" />
          Your Projects
        </h2>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create or join a team to start your first project."
            action={
              <Link to="/teams" className="text-sm font-medium text-primary hover:underline">
                Create or join a team →
              </Link>
            }
          />
        ) : (
          projects.map((card) => (
            <Link
              key={card.project._id}
              to={`/project/${card.project._id}`}
              className="block rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{card.project.title}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {card.project.team?.name || "Solo project"} · {card.project.status}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                  {card.progressPct}%
                  <ArrowRight size={12} />
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-text-secondary sm:grid-cols-4">
                <span>
                  Milestones: {card.milestonesCompleted}/{card.milestonesTotal}
                </span>
                <span>
                  Tasks: {card.tasksCompleted}/{card.tasksTotal}
                </span>
                <span className={card.tasksPending ? "font-medium text-warning" : ""}>
                  Pending: {card.tasksPending}
                </span>
                <span className={card.myTasks ? "font-medium text-primary" : ""}>
                  Mine: {card.myTasks}
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${card.progressPct}%` }}
                />
              </div>

              {card.nextDeadline && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                  <Calendar size={12} className="text-text-muted" />
                  Next deadline: {fmtDate(card.nextDeadline)}
                </p>
              )}
            </Link>
          ))
        )}
      </div>

      {/* Recent faculty feedback */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
          <MessageSquare size={18} className="text-primary" />
          Recent Faculty Feedback
        </h2>
        {recentFeedback.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No feedback yet"
            description="Assign a faculty reviewer from your project page to get started."
          />
        ) : (
          <div className="space-y-3">
            {recentFeedback.map((review) => (
              <div
                key={review._id}
                className="cursor-pointer rounded-xl border border-border bg-surface p-4 shadow-sm transition-colors hover:border-primary/50"
                onClick={() => navigate(`/project/${review.project?._id}`)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {review.project?.title || "Project"}
                  </p>
                  <span className="text-xs text-text-muted">{fmtDate(review.createdAt)}</span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                  <Star size={11} className="text-warning" />
                  {review.faculty?.name || "Faculty"}
                  {review.rating ? ` · ${review.rating}/5` : ""}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboardPage;