import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GraduationCap, ArrowRight, Users, Star, Clock, TrendingUp, FolderKanban } from "lucide-react";
import { fetchFacultyDashboard } from "../../store/slices/dashboardSlice";
import PageLoader from "../../components/PageLoader";
import EmptyState from "../../components/EmptyState";

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

function FacultyDashboardPage() {
  const dispatch = useDispatch();
  const { faculty, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchFacultyDashboard());
  }, [dispatch]);

  const stats = faculty?.stats;
  const statCards = [
    { icon: FolderKanban, label: "Assigned Projects", value: stats?.assignedProjects ?? 0 },
    { icon: TrendingUp, label: "Milestones Completed", value: stats?.totalMilestonesCompleted ?? 0 },
    { icon: Clock, label: "Pending Tasks", value: stats?.totalTasksPending ?? 0 },
    { icon: Star, label: "Feedback Given", value: stats?.totalFeedback ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap size={26} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Faculty Portal</h1>
          <p className="text-sm text-text-secondary">Projects assigned to you for review</p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-error-light bg-error-light px-4 py-2 text-sm text-error">
          {error}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <card.icon size={20} className="text-primary" />
            <p className="mt-3 text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-sm font-medium text-text-secondary">{card.label}</p>
          </div>
        ))}
      </div>

      {isLoading && !faculty ? (
        <PageLoader minHeight="300px" label="Loading assigned projects…" />
      ) : !faculty || faculty.projects.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No projects assigned to you yet"
          description="Students invite their team leader to assign a faculty reviewer from the project page."
        />
      ) : (
        <div className="space-y-4">
          {faculty.projects.map((card) => {
            const project = card.project;
            const members = [
              ...(project.team?.leader ? [project.team.leader] : []),
              ...(project.team?.members || []),
            ];
            return (
              <Link
                key={project._id}
                to={`/faculty/project/${project._id}`}
                className="block rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">{project.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                      {project.description}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">
                    {card.progressPct}%
                    <ArrowRight size={12} />
                  </span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${card.progressPct}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-surface-dark px-2.5 py-0.5 font-semibold text-text-secondary">
                    {project.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-text-muted">
                    <Users size={12} />
                    {members.length} member{members.length === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-text-muted">
                    <Clock size={12} />
                    {card.tasksPending} pending task{card.tasksPending === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-text-muted">
                    <Star size={12} />
                    {card.feedbackCount} feedback{card.feedbackCount === 1 ? "" : ""}
                    {card.lastFeedbackAt ? ` · last ${fmtDate(card.lastFeedbackAt)}` : ""}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FacultyDashboardPage;