import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { logout } from "../store/slices/authSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <UserIcon size={28} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {user.name}
            </h1>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Role
            </dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-text-primary">
              {user.role}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              User ID
            </dt>
            <dd className="mt-1 break-all text-sm text-text-primary">
              {user.id}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-error hover:text-error"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;