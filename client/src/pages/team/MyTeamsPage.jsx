import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Users, Plus } from "lucide-react";
import { getMyTeams } from "../../store/slices/teamSlice";

function MyTeamsPage() {
  const dispatch = useDispatch();
  const { myTeams, isLoading } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(getMyTeams());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-text-secondary">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">My Teams</h1>
        <Link
          to="/team/setup"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Create / Join
        </Link>
      </div>

      <div className="mt-8">
        {!myTeams || myTeams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-sm">
              <Users size={24} className="text-text-muted" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">
              No teams yet
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Start your academic project journey by creating a new team or joining an existing one.
            </p>
            <Link
              to="/team/setup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myTeams.map((team) => (
              <Link
                key={team._id}
                to={`/team/${team._id}`}
                className="group rounded-xl border border-border bg-surface p-6 shadow-sm transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-text-primary line-clamp-1">
                    {team.name}
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
                  <span>{team.members.length} Member{team.members.length !== 1 && 's'}</span>
                  <span className="font-medium text-primary group-hover:text-primary-dark">
                    View Team →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeamsPage;
