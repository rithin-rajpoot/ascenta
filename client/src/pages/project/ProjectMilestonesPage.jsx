import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Milestone as MilestoneIcon,
  Edit3,
  Trash2,
  X,
  Calendar,
  ListChecks,
} from "lucide-react";
import {
  getProject,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../store/slices/projectSlice";

const STATUSES = ["Pending", "In Progress", "Completed"];

const statusStyle = {
  Pending: "bg-background text-text-secondary border-border",
  "In Progress": "bg-warning-light text-warning border-warning/30",
  Completed: "bg-success-light text-success border-success/30",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

function ProjectMilestonesPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProject, milestones, isLoading, error } = useSelector((state) => state.project);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", deadline: "", status: "Pending" });

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getMilestones(id));
    }
  }, [dispatch, id]);

  const project = currentProject;
  // The auth user is stored as { id, name, email, role } (see authService) —
  // fall back to _id for safety. team.leader may be populated (object) or an id.
  const userId = user?.id || user?._id;
  const isOwner =
    !!userId && !!project?.owner && String(project.owner._id || project.owner) === String(userId);
  const isLeader =
    !!userId &&
    !!project?.team?.leader &&
    String(project.team.leader._id || project.team.leader) === String(userId);
  const isManager = isOwner || isLeader;

  const completed = milestones.filter((m) => m.status === "Completed").length;
  const progress = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  const resetForm = () => {
    setForm({ title: "", description: "", deadline: "", status: "Pending" });
    setEditing(null);
    setFormOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", deadline: "", status: "Pending" });
    setFormOpen(true);
  };

  const openEdit = (milestone) => {
    setEditing(milestone);
    setForm({
      title: milestone.title,
      description: milestone.description || "",
      deadline: toDateInputValue(milestone.deadline),
      status: milestone.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      await dispatch(
        updateMilestone({
          projectId: id,
          milestoneId: editing._id,
          data: {
            title: form.title,
            description: form.description,
            deadline: form.deadline || null,
            status: form.status,
          },
        })
      );
    } else {
      await dispatch(
        createMilestone({
          projectId: id,
          data: {
            title: form.title,
            description: form.description,
            deadline: form.deadline || null,
            status: form.status,
          },
        })
      );
    }
    resetForm();
  };

  const handleStatusChange = (milestone, status) => {
    dispatch(
      updateMilestone({
        projectId: id,
        milestoneId: milestone._id,
        data: {
          title: milestone.title,
          description: milestone.description || "",
          deadline: milestone.deadline || null,
          status,
        },
      })
    );
  };

  const handleDelete = async (milestoneId) => {
    await dispatch(deleteMilestone({ projectId: id, milestoneId }));
    setConfirmDeleteId(null);
  };

  if (!project && isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{error}</p>
        <Link to="/teams" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/project/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>
        {isManager && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Plus size={16} />
            Add Milestone
          </button>
        )}
      </div>

      <div className="mt-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
          <MilestoneIcon size={24} className="text-primary" />
          Milestones
        </h1>
        <p className="mt-1 text-text-secondary">{project?.title || "Project"} — development plan</p>
      </div>
{/* Progress card */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">
            <span className="inline-flex items-center gap-1.5">
              <ListChecks size={16} className="text-primary" />
              Overall Progress
            </span>
          </p>
          <p className="text-sm text-text-secondary">
            {completed} of {milestones.length} completed
          </p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-success transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-sm font-semibold text-text-primary">{progress}%</p>
      </div>

      {/* Error banner */}
      {error && (
        <p className="mt-4 rounded-lg border border-error-light bg-error-light p-3 text-sm text-error">
          {error}
        </p>
      )}
{/* Add / Edit form */}
      {isManager && formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-primary-light bg-primary-light/10 p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-primary">
              {editing ? "Edit Milestone" : "New Milestone"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded p-1 text-text-muted hover:text-text-primary"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Literature Survey"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Description</label>
              <textarea
                name="description"
                rows="2"
                value={form.description}
                onChange={handleChange}
                placeholder="What needs to be accomplished in this milestone?"
                className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-text-primary">
                <Calendar size={14} /> Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {editing ? "Save Changes" : "Add Milestone"}
            </button>
          </div>
        </form>
      )}
{/* Milestone list */}
      <div className="mt-6 space-y-4">
        {isLoading && milestones.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : milestones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <MilestoneIcon size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-secondary">No milestones yet.</p>
            <p className="mt-1 text-sm text-text-muted">
              {isManager
                ? "Click “Add Milestone” to start planning your project."
                : "The team leader has not added milestones yet."}
            </p>
          </div>
        ) : (
          milestones.map((milestone, idx) => (
            <div
              key={milestone._id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{milestone.title}</h3>
                    {milestone.description && (
                      <p className="mt-1 text-sm text-text-secondary">{milestone.description}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[milestone.status] || statusStyle.Pending}`}
                >
                  {milestone.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                {milestone.deadline ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <Calendar size={14} className="text-text-muted" />
                    Due: {formatDate(milestone.deadline)}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted">No deadline set</p>
                )}

                {isManager ? (
                  <div className="flex items-center gap-3">
                    <select
                      value={milestone.status}
                      onChange={(e) => handleStatusChange(milestone, e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => openEdit(milestone)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(milestone._id)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-error hover:text-error"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">
                    {milestone.createdBy?.name ? `Created by ${milestone.createdBy.name}` : ""}
                  </p>
                )}
              </div>

              {confirmDeleteId === milestone._id && (
                <div className="mt-4 rounded-lg border border-error-light bg-error-light p-3">
                  <p className="text-sm text-error">
                    Delete “{milestone.title}”? This cannot be undone.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(milestone._id)}
                      className="rounded-lg bg-error px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-background"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectMilestonesPage;