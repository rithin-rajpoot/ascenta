import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  ArrowLeft,
  Plus,
  ListChecks,
  Edit3,
  Trash2,
  X,
  Calendar,
  Filter,
} from "lucide-react";
import { getProject } from "../../store/slices/projectSlice";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../store/slices/taskSlice";

const COLUMNS = ["Todo", "In Progress", "Review", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

const columnStyle = {
  Todo: "border-border",
  "In Progress": "border-warning/40",
  Review: "border-primary/40",
  Completed: "border-success/40",
};

const priorityStyle = {
  Low: "bg-background text-text-secondary border-border",
  Medium: "bg-warning-light text-warning border-warning/30",
  High: "bg-error-light text-error border-error/30",
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

function ProjectTasksPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProject, isLoading: projectLoading, error: projectError } = useSelector(
    (state) => state.project
  );
  const { tasks, isLoading: tasksLoading, error: tasksError } = useSelector((state) => state.task);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [formError, setFormError] = useState(null);
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    status: "Todo",
  });

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getTasks(id));
    }
  }, [dispatch, id]);

  const project = currentProject;

  // Same permission model as the milestones page: the auth user is stored as
  // { id, ... } and team.leader/members are populated user objects.
  const userId = user?.id || user?._id;
  const isOwner =
    !!userId && !!project?.owner && String(project.owner._id || project.owner) === String(userId);
  const isLeader =
    !!userId &&
    !!project?.team?.leader &&
    String(project.team.leader._id || project.team.leader) === String(userId);
  const isManager = isOwner || isLeader;

  // Assignable users: team leader + members (deduped).
  const assignableUsers = [];
  const seen = new Set();
  const addUser = (u) => {
    if (!u) return;
    const uid = String(u._id || u);
    if (seen.has(uid)) return;
    seen.add(uid);
    assignableUsers.push(u);
  };
  addUser(project?.team?.leader);
  (project?.team?.members || []).forEach(addUser);

  const canMoveTask = (task) =>
    isManager ||
    (task.assignedTo && String(task.assignedTo._id || task.assignedTo) === String(userId));

  const resetForm = () => {
    setForm({ title: "", description: "", assignedTo: "", priority: "Medium", dueDate: "", status: "Todo" });
    setEditing(null);
    setFormOpen(false);
    setFormError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", assignedTo: "", priority: "Medium", dueDate: "", status: "Todo" });
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo ? String(task.assignedTo._id || task.assignedTo) : "",
      priority: task.priority,
      dueDate: toDateInputValue(task.dueDate),
      status: task.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setFormError(null);

    const data = {
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo || null,
      priority: form.priority,
      dueDate: form.dueDate || null,
      status: form.status,
    };

    const result = editing
      ? await dispatch(updateTask({ projectId: id, taskId: editing._id, data }))
      : await dispatch(createTask({ projectId: id, data }));

    if (result.meta.requestStatus === "fulfilled") {
      resetForm();
    } else {
      setFormError(result.payload || "Something went wrong");
    }
  };

  const handleStatusChange = async (task, status) => {
    if (status === task.status) return;
    await dispatch(updateTask({ projectId: id, taskId: task._id, data: { status } }));
  };

  const handleDelete = async (taskId) => {
    await dispatch(deleteTask({ projectId: id, taskId }));
    setConfirmDeleteId(null);
  };

  const handleDragStart = (task) => {
    setDraggedId(task._id);
  };

  const handleDrop = async (status) => {
    setDragOverCol(null);
    const task = tasks.find((t) => t._id === draggedId);
    setDraggedId(null);
    if (!task || task.status === status || !canMoveTask(task)) return;
    await dispatch(updateTask({ projectId: id, taskId: task._id, data: { status } }));
  };

  const filteredTasks = tasks.filter(
    (t) =>
      (assigneeFilter === "all" ||
        (assigneeFilter === "unassigned" && !t.assignedTo) ||
        (t.assignedTo && String(t.assignedTo._id || t.assignedTo) === assigneeFilter)) &&
      (priorityFilter === "all" || t.priority === priorityFilter)
  );

  if (projectLoading && !project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{projectError || "Project not found"}</p>
        <Link to="/teams" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const memberName = (task) =>
    task.assignedTo ? task.assignedTo.name || "Team member" : "Unassigned";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ListChecks size={24} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Task Board</h1>
          <p className="text-sm text-text-secondary">{project.title}</p>
        </div>
      </div>

      {tasksError && (
        <p className="rounded-lg border border-error-light bg-error-light px-4 py-2 text-sm text-error">
          {tasksError}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
          <Filter size={15} className="text-text-muted" />
          Filter
        </span>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {assignableUsers.map((u) => (
            <option key={String(u._id || u)} value={String(u._id || u)}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Add / Edit form */}
      {isManager && formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              {editing ? "Edit Task" : "New Task"}
            </h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          </div>

          {formError && (
            <p className="rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
              {formError}
            </p>
          )}

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="">Unassigned</option>
              {assignableUsers.map((u) => (
                <option key={String(u._id || u)} value={String(u._id || u)}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p} priority
                </option>
              ))}
            </select>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              {COLUMNS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {editing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      )}

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col);
          return (
            <div
              key={col}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col);
              }}
              onDragLeave={() => setDragOverCol((c) => (c === col ? null : c))}
              onDrop={() => handleDrop(col)}
              className={`rounded-xl border-2 bg-surface/50 p-3 transition-colors ${columnStyle[col]} ${
                dragOverCol === col ? "border-primary bg-primary-light/40" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-text-primary">{col}</h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasksLoading && !tasks.length ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-primary" />
                  </div>
                ) : colTasks.length === 0 ? (
                  <p className="py-6 text-center text-xs text-text-muted">
                    {isManager ? "Drop tasks here" : "No tasks"}
                  </p>
                ) : (
                  colTasks.map((task) => {
                    return (
                      <div
                        key={task._id}
                        draggable={canMoveTask(task)}
                        onDragStart={() => handleDragStart(task)}
                        className={`rounded-lg border border-border bg-surface p-3 shadow-sm ${
                          canMoveTask(task) ? "cursor-grab active:cursor-grabbing" : ""
                        } ${draggedId === task._id ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-text-primary">{task.title}</p>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${priorityStyle[task.priority] || priorityStyle.Medium}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-text-muted">
                            {task.assignedTo ? task.assignedTo.name || "Team member" : "Unassigned"}
                            {task.dueDate && (
                              <span className="ml-2 inline-flex items-center gap-1">
                                <Calendar size={11} />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </span>
                          {isManager && (
                            <span className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(task)}
                                className="text-text-muted hover:text-primary"
                                title="Edit task"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(task._id)}
                                className="text-text-muted hover:text-error"
                                title="Delete task"
                              >
                                <Trash2 size={14} />
                              </button>
                            </span>
                          )}
                        </div>

                        {canMoveTask(task) && (
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                            className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                          >
                            {COLUMNS.map((s) => (
                              <option key={s} value={s}>
                                Move to {s}
                              </option>
                            ))}
                          </select>
                        )}

                        {confirmDeleteId === task._id && (
                          <div className="mt-2 rounded-md border border-error-light bg-error-light p-2">
                            <p className="text-xs text-error">Delete this task?</p>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="rounded-md bg-error px-2 py-1 text-xs font-medium text-white hover:opacity-90"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-text-primary hover:bg-background"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectTasksPage;