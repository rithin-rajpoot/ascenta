import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import { joinTeam, clearError } from "../../store/slices/teamSlice";

function JoinTeamPage() {
  const [teamId, setTeamId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.team);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(joinTeam(teamId.trim())).then((action) => {
      if (action.type === "team/join/fulfilled") {
        navigate(`/team/${action.payload._id}`);
      }
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <Link
        to="/team/setup"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <UserPlus size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Join a Team
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Enter the team ID to join an existing team.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-error bg-error-light px-4 py-2 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Team ID
            </label>
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
              placeholder="Team ID"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {isLoading ? "Joining team..." : "Join Team"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinTeamPage;