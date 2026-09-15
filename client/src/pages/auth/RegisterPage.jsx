import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, BookOpen } from "lucide-react";
import { registerUser, clearError } from "../../store/slices/authSlice";
import { notifySuccess, notifyErrorFrom } from "../../utils/toast";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
    dispatch(clearError());
  }, [user, navigate, dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleRoleChange = (role) => setForm({ ...form, role });

  const validate = () => {
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) errors.name = "Full name is required.";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < MIN_PASSWORD_LENGTH)
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    return errors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(
      registerUser({ ...form, name: form.name.trim(), email: form.email.trim() })
    ).then((action) => {
      if (action.type === "auth/register/fulfilled") {
        notifySuccess("Account created successfully");
      } else {
        notifyErrorFrom(action.payload, "Registration failed");
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <UserPlus size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Join Ascenta to manage projects
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-error bg-error-light px-4 py-2 text-sm text-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                form.role === "student"
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border bg-background text-text-secondary hover:border-border-hover"
              }`}
            >
              <User size={16} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("faculty")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                form.role === "faculty"
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border bg-background text-text-secondary hover:border-border-hover"
              }`}
            >
              <BookOpen size={16} />
              Faculty
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Your name"
              aria-invalid={fieldErrors.name ? "true" : undefined}
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none ${
                fieldErrors.name ? "border-error focus:border-error" : "border-border focus:border-primary"
              }`}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-error">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="you@example.com"
              aria-invalid={fieldErrors.email ? "true" : undefined}
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none ${
                fieldErrors.email ? "border-error focus:border-error" : "border-border focus:border-primary"
              }`}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-error">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              placeholder="At least 6 characters"
              aria-invalid={fieldErrors.password ? "true" : undefined}
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none ${
                fieldErrors.password ? "border-error focus:border-error" : "border-border focus:border-primary"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-error">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;