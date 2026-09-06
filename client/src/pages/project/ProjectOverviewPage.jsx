import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ArrowLeft, CheckCircle2, Milestone as MilestoneIcon, ArrowRight } from "lucide-react";
import { getProject, getMilestones } from "../../store/slices/projectSlice";

function ProjectOverviewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, milestones, isLoading, error } = useSelector((state) => state.project);

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getMilestones(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !currentProject) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{error || "Project not found"}</p>
        <Link to="/teams" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/teams"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                {currentProject.status}
              </span>
              <span className="inline-block rounded-full bg-surface-dark px-3 py-1 text-xs font-semibold text-text-secondary">
                {currentProject.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">{currentProject.title}</h1>
            <p className="text-text-secondary leading-relaxed">{currentProject.description}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <MilestoneIcon size={20} className="text-primary" />
                Milestones
              </h2>
              <Link
                to={`/project/${id}/milestones`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
              >
                Manage <ArrowRight size={15} />
              </Link>
            </div>
            {(() => {
              const done = milestones.filter((m) => m.status === "Completed").length;
              const pct = milestones.length ? Math.round((done / milestones.length) * 100) : 0;
              return (
                <div className="mt-4">
                  <p className="text-sm text-text-secondary">
                    {done} of {milestones.length} milestones completed
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Problem Statement</h2>
            <p className="text-text-secondary whitespace-pre-line">{currentProject.problemStatement || "Not defined"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Methodology</h2>
            <p className="text-text-secondary whitespace-pre-line">{currentProject.methodology || "Not defined"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Objectives</h2>
            {currentProject.objectives?.length ? (
              <ul className="list-inside list-disc space-y-1 text-text-secondary">
                {currentProject.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary">Not defined</p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Scope</h2>
            <p className="text-text-secondary whitespace-pre-line">{currentProject.scope || "Not defined"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Target Users</h2>
            {currentProject.targetUsers?.length ? (
              <ul className="list-inside list-disc space-y-1 text-text-secondary">
                {currentProject.targetUsers.map((user, i) => (
                  <li key={i}>{user}</li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary">Not defined</p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Expected Outcome</h2>
            <p className="text-text-secondary whitespace-pre-line">{currentProject.expectedOutcome || "Not defined"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-4">Future Scope</h2>
            <p className="text-text-secondary whitespace-pre-line">{currentProject.futureScope || "Not defined"}</p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-80 space-y-6">
          
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Details</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-text-muted mb-1">Domain</p>
                <p className="font-medium text-text-primary">{currentProject.domain || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-text-muted mb-1">Technologies</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProject.technologies?.map((tech, i) => (
                    <span key={i} className="rounded-md bg-background px-2 py-1 text-xs text-text-secondary border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Features</h3>
            <ul className="space-y-3">
              {currentProject.features?.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className={f.isCore ? "text-primary mt-0.5" : "text-text-muted mt-0.5"} />
                  <span>
                    {f.name} {f.isCore ? "" : <span className="text-xs text-text-muted italic">(Optional)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">SDG Mapping</h3>
            <div className="space-y-4">
              {currentProject.sdgs?.map((sdg, i) => (
                <div key={i} className="text-sm">
                  <p className="font-semibold text-text-primary">{sdg.goal}</p>
                  <p className="text-text-secondary text-xs mt-1">{sdg.reason}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProjectOverviewPage;
