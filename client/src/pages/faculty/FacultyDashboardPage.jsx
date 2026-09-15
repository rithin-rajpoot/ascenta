import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, GraduationCap, ArrowRight, Users } from "lucide-react";
import { getAssignedProjects } from "../../store/slices/facultySlice";

function FacultyDashboardPage() {
  const dispatch = useDispatch();
  const { assignedProjects, isLoading, error } = useSelector((state) => state.faculty);

  useEffect(() => {
    dispatch(getAssignedProjects());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
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

      {isLoading && !assignedProjects.length ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 size={30} className="animate-spin text-primary" />
        </div>
      ) : assignedProjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
          <p className="text-text-secondary">No projects assigned to you yet.</p>
          <p className="mt-1 text-sm text-text-muted">
            Students invite their team leader to assign a faculty reviewer from the project page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignedProjects.map((project) => {
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
                  <ArrowRight size={18} className="mt-1 shrink-0 text-text-muted" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-surface-dark px-2.5 py-0.5 font-semibold text-text-secondary">
                    {project.status}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-text-secondary border border-border">
                    {project.domain || "General"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-text-muted">
                    <Users size={12} />
                    {members.length} team member{members.length === 1 ? "" : "s"}
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