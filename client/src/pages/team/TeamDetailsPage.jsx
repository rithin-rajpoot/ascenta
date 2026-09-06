import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Users, Trash2, Crown, ArrowLeft, FolderKanban, MapPin, Layers, ListChecks, Target, ArrowRight, UserPlus, CheckCircle2, XCircle, Loader2, Copy, Check, Link2 } from "lucide-react";
import {
  getTeam,
  inviteMember,
  removeMember,
  clearError,
  clearTeam,
} from "../../store/slices/teamSlice";
import { getTeamProjects } from "../../store/slices/projectSlice";

function TeamDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { team, isLoading, error } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const { teamProjects, isLoading: projectsLoading, error: projectsError } = useSelector((state) => state.project);
  const [inviteUserId, setInviteUserId] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearTeam());
    dispatch(getTeam(id));
    dispatch(getTeamProjects(id));
  }, [dispatch, id]);

  const copyInviteCode = async () => {
    if (!team?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(team.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isLeader = team && user && team.leader?._id === user.id;

  // Latest project for the team (teamProjects is sorted by newest first)
  const project = teamProjects && teamProjects.length > 0 ? teamProjects[0] : null;

  const formatList = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "Not defined";

  const handleInvite = async (e) => {
    e.preventDefault();
    const userId = inviteUserId.trim();
    setFormError("");
    setNotice("");

    if (!userId) {
      setFormError("Please enter a user ID to invite.");
      return;
    }
    if (isLeader && userId === user.id) {
      setFormError("You are the team leader and cannot invite yourself.");
      return;
    }

    dispatch(clearError());
    setInviting(true);
    const action = await dispatch(inviteMember({ teamId: id, userId }));
    setInviting(false);

    if (action.type === "team/invite/fulfilled") {
      setInviteUserId("");
      setNotice("Member invited successfully.");
    }
  };

  const handleRemove = async (userId) => {
    if (removingId) return;
    if (!window.confirm("Remove this member from the team?")) return;

    dispatch(clearError());
    setNotice("");
    setRemovingId(userId);
    const action = await dispatch(removeMember({ teamId: id, userId }));
    setRemovingId(null);

    if (action.type === "team/removeMember/fulfilled") {
      setNotice("Member removed from the team.");
    }
  };

  if (isLoading) {
    return <p className="text-center text-text-secondary">Loading team...</p>;
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-md text-center">
        {error ? (
          <div className="rounded-lg border border-error bg-error-light px-4 py-3 text-sm text-error">
            {error}
          </div>
        ) : (
          <p className="text-text-secondary">You are not currently part of a team.</p>
        )}
        <Link
          to="/team/setup"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Set up a team
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/teams"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Teams
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
              <Users size={26} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{team.name}</h1>
              <p className="text-sm text-text-secondary">
                {isLeader ? "You are the team leader" : "You are a team member"}
                {team.members?.length ? (
                  <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {team.members.length} member{team.members.length > 1 ? "s" : ""}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          {isLeader &&
            (project ? (
              <span
                title="This team already has a project"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-primary/40 px-4 py-2 text-sm font-medium text-white"
              >
                <FolderKanban size={16} /> Project Created
              </span>
            ) : (
              !projectsLoading && (
                <Link
                  to={{ pathname: "/project/setup", state: { teamId: id } }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Start Project
                </Link>
              )
            ))}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-error bg-error-light px-4 py-2 text-sm text-error">
            <XCircle size={16} /> {error}
          </div>
        )}

        {notice && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary bg-primary-light px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle2 size={16} /> {notice}
          </div>
        )}

        {/* Invite code */}
        {team.inviteCode && (
          <div className="mt-8 rounded-xl border border-dashed border-primary bg-primary-light/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Link2 size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Team Invite Code
                  </p>
                  <p className="text-xs text-text-secondary">
                    Share this code so teammates can join this team.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyInviteCode}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-primary-dark"
              >
                <span className="text-base tracking-[0.15em]">
                  {team.inviteCode}
                </span>
                {copied ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Project */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Project
          </h2>

          {project ? (
            <div className="mt-2 rounded-xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                      <FolderKanban size={18} />
                    </span>
                    <div>
                      <Link
                        to={`/project/${project._id}`}
                        className="font-semibold text-text-primary hover:text-primary inline-flex items-center gap-1"
                      >
                        {project.title}
                        <ArrowRight size={14} />
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {project.status || "Idea"}
                        </span>
                        {project.difficulty && (
                          <span className="inline-block rounded-full bg-surface-dark px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                            {project.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  View Project <ArrowRight size={16} />
                </Link>
              </div>

              {project.description && (
                <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                  {project.description}
                </p>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Domain</p>
                    <p className="text-sm text-text-primary">{project.domain || "Not defined"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Layers size={16} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Technologies</p>
                    <p className="text-sm text-text-primary">{formatList(project.technologies)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target size={16} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Objectives</p>
                    <p className="text-sm text-text-primary">{formatList(project.objectives)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ListChecks size={16} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Features</p>
                    <p className="text-sm text-text-primary">
                      {project.features?.length
                        ? `${project.features.length} feature${project.features.length > 1 ? "s" : ""} defined`
                        : "Not defined"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-text-muted">
                Problem statement, scope, SDG mapping, methodology, expected outcome and future scope are
                available on the project page.
              </p>
            </div>
          ) : (
            <>
              {projectsError && (
                <p className="mt-2 text-sm text-error">Could not load team project: {projectsError}</p>
              )}
              <p className="mt-2 text-sm text-text-secondary">
                {isLeader
                  ? "No project yet. Start one to generate a structured blueprint."
                  : "No project has been created yet for this team."}
              </p>
            </>
          )}
        </div>

        {/* Leader */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Leader
          </h2>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
              <Crown size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {team.leader?.name}
              </p>
              <p className="text-xs text-text-muted">{team.leader?.email}</p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Members
          </h2>
          <div className="mt-2 space-y-2">
            {team.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Users size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {member.name}
                      {member._id === team.leader?._id && (
                        <span className="ml-2 text-xs font-medium text-primary">
                          (Leader)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted">{member.email}</p>
                  </div>
                </div>
                {isLeader && member._id !== team.leader?._id && (
                  <button
                    onClick={() => handleRemove(member._id)}
                    disabled={removingId === member._id}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-error-light hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
                    title={removingId === member._id ? "Removing..." : "Remove member"}
                  >
                    {removingId === member._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invite (leader only) */}
        {isLeader && (
          <form onSubmit={handleInvite} className="mt-6 rounded-xl border border-border bg-background p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
              <UserPlus size={16} className="text-primary" /> Invite Member
            </h3>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                required
                disabled={inviting}
                placeholder="User ID"
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={inviting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inviting && <Loader2 size={16} className="animate-spin" />}
                {inviting ? "Inviting..." : "Invite"}
              </button>
            </div>
            {formError && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-error">
                <XCircle size={14} /> {formError}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default TeamDetailsPage;