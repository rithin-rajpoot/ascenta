import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Users, Trash2, Crown, ArrowLeft } from "lucide-react";
import {
  getTeam,
  inviteMember,
  removeMember,
  clearError,
} from "../../store/slices/teamSlice";

function TeamDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { team, isLoading, error } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const [inviteUserId, setInviteUserId] = useState("");

  useEffect(() => {
    dispatch(getTeam(id));
  }, [dispatch, id]);

  const isLeader = team && user && team.leader?._id === user.id;

  const handleInvite = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(inviteMember({ teamId: id, userId: inviteUserId }));
    setInviteUserId("");
  };

  const handleRemove = (userId) => {
    dispatch(clearError());
    dispatch(removeMember({ teamId: id, userId }));
  };

  if (isLoading) {
    return <p className="text-center text-text-secondary">Loading team...</p>;
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-text-secondary">You are not currently part of a team.</p>
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
        to="/team/setup"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back
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
                {isLeader ? "You are the team leader" : "Team member"}
              </p>
            </div>
          </div>
          {isLeader && (
            <Link
              to="/project/setup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Start Project
            </Link>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-error bg-error-light px-4 py-2 text-sm text-error">
            {error}
          </div>
        )}

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
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-error-light hover:text-error"
                    title="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invite (leader only) */}
        {isLeader && (
          <form onSubmit={handleInvite} className="mt-6 rounded-xl border border-border bg-background p-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Invite Member
            </h3>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                required
                placeholder="User ID"
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Invite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TeamDetailsPage;