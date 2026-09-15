import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ArrowLeft, CheckCircle2, Milestone as MilestoneIcon, ListChecks as TaskIcon, GraduationCap, MessageSquare, Star, Sparkles as SparklesIcon, ArrowRight } from "lucide-react";
import { getProject, getMilestones } from "../../store/slices/projectSlice";
import { getTasks } from "../../store/slices/taskSlice";
import { getFacultyList, getProjectReviews, assignFaculty } from "../../store/slices/facultySlice";
import { notifySuccess, notifyErrorFrom } from "../../utils/toast";
import PageLoader from "../../components/PageLoader";
import ProjectTabs from "../../components/ProjectTabs";

function ProjectOverviewPage({ embedded = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProject, milestones, isLoading, error } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);
  const { facultyList, reviews } = useSelector((state) => state.faculty);
  const [assignError, setAssignError] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const userId = user?.id || user?._id;
  const isManager =
    !!userId &&
    !!currentProject &&
    (String(currentProject.owner?._id || currentProject.owner || "") === String(userId) ||
      String(currentProject.team?.leader?._id || currentProject.team?.leader || "") === String(userId));

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getMilestones(id));
      dispatch(getTasks(id));
      dispatch(getFacultyList());
      dispatch(getProjectReviews(id));
    }
  }, [dispatch, id]);

  const openAssignModal = () => {
    setSelectedFacultyId(
      currentProject.assignedFaculty
        ? String(currentProject.assignedFaculty._id || currentProject.assignedFaculty)
        : ""
    );
    setAssignError(null);
    setAssignOpen(true);
  };

  const handleAssignFaculty = async () => {
    if (!selectedFacultyId) return;
    setIsAssigning(true);
    setAssignError(null);
    const result = await dispatch(assignFaculty({ projectId: id, facultyId: selectedFacultyId }));
    setIsAssigning(false);
    if (result.meta.requestStatus === "fulfilled") {
      // currentProject is updated live via the projectSlice listener — no refresh needed.
      notifySuccess("Faculty reviewer assigned successfully");
      setAssignOpen(false);
    } else {
      const message = result.payload || "Failed to assign faculty";
      setAssignError(message);
      notifyErrorFrom(message, "Failed to assign faculty");
    }
  };

  if (isLoading) {
    return <PageLoader label="Loading project…" />;
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
    <div className="mx-auto max-w-6xl space-y-6">
      {!embedded && (
        <>
          <Link
            to="/teams"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <ProjectTabs id={id} />
        </>
      )}

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

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <TaskIcon size={20} className="text-primary" />
                Tasks
              </h2>
              <Link
                to={`/project/${id}/tasks`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
              >
                Open Board <ArrowRight size={15} />
              </Link>
            </div>
            {(() => {
              const done = tasks.filter((t) => t.status === "Completed").length;
              const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
              return (
                <div className="mt-4">
                  <p className="text-sm text-text-secondary">
                    {done} of {tasks.length} tasks completed
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Faculty Review */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <GraduationCap size={20} className="text-primary" />
                Faculty Review
              </h2>
              {isManager && (
                <button
                  onClick={openAssignModal}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-text-primary hover:border-primary hover:text-primary"
                >
                  <GraduationCap size={15} />
                  {currentProject.assignedFaculty ? "Change Reviewer" : "Assign Faculty"}
                </button>
              )}
            </div>
            {currentProject.assignedFaculty && (
              <p className="mt-3 text-sm text-text-secondary">
                Reviewer: {currentProject.assignedFaculty.name}
                {currentProject.assignedFaculty.email ? ` · ${currentProject.assignedFaculty.email}` : ""}
              </p>
            )}
            {assignError && (
              <p className="mt-3 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
                {assignError}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <MessageSquare size={14} className="text-text-muted" />
                Feedback history ({reviews.length})
              </p>
              {reviews.length === 0 ? (
                <p className="text-sm text-text-muted">
                  {currentProject.assignedFaculty
                    ? "No feedback yet. Your faculty reviewer will share feedback here."
                    : "No faculty reviewer assigned yet."}
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {review.faculty?.name || "Faculty"}
                      </p>
                      <span className="text-xs text-text-muted">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {review.rating && (
                      <p className="mt-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < review.rating ? "fill-warning text-warning" : "text-text-muted"}
                          />
                        ))}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-text-secondary whitespace-pre-line">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assign Faculty modal */}
          {assignOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setAssignOpen(false)}
            >
              <div
                className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary">
                    {currentProject.assignedFaculty ? "Change Faculty Reviewer" : "Assign Faculty Reviewer"}
                  </h3>
                  <button
                    onClick={() => setAssignOpen(false)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Select a faculty member and confirm. They will be able to view this project and
                  leave feedback.
                </p>

                <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                  {facultyList.length === 0 ? (
                    <p className="py-4 text-center text-sm text-text-muted">No faculty members found.</p>
                  ) : (
                    facultyList.map((f) => {
                      const selected = selectedFacultyId === f._id;
                      return (
                        <button
                          key={f._id}
                          type="button"
                          onClick={() => setSelectedFacultyId(f._id)}
                          className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                            selected
                              ? "border-primary bg-primary-light/50"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          <p className="text-sm font-medium text-text-primary">{f.name}</p>
                          <p className="text-xs text-text-muted">{f.email}</p>
                        </button>
                      );
                    })
                  )}
                </div>

                {assignError && (
                  <p className="mt-3 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
                    {assignError}
                  </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setAssignOpen(false)}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary hover:bg-background"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignFaculty}
                    disabled={!selectedFacultyId || isAssigning}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {isAssigning && <Loader2 size={14} className="animate-spin" />}
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                <SparklesIcon size={20} className="text-primary" />
                AI Assistant
              </h2>
              <Link
                to={`/project/${id}/assistant`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
              >
                Open <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              Ask technical questions about your project — APIs, database design, auth,
              architecture, debugging. Answers are aware of your blueprint.
            </p>
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
