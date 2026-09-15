import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, MessageSquare, Star, Loader2 } from "lucide-react";
import ProjectOverviewPage from "../project/ProjectOverviewPage";
import {
  getFacultyProjectDetail,
  submitReview,
  getProjectReviews,
} from "../../store/slices/facultySlice";

// Faculty view of an assigned project: the exact same page students see
// (embedded, read-only) plus the faculty-only feedback form.
function FacultyProjectPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentFacultyProject, isLoading, error } = useSelector((state) => state.faculty);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Warm the faculty slice (used for loading/error state) and faculty list.
  useEffect(() => {
    if (id) dispatch(getFacultyProjectDetail(id));
  }, [dispatch, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setFormError(null);

    const result = await dispatch(
      submitReview({
        projectId: id,
        data: { comment, rating: rating ? Number(rating) : null },
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setComment("");
      setRating("");
      setSubmitted(true);
      // Refresh the feedback history shown in the embedded overview.
      dispatch(getProjectReviews(id));
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setFormError(result.payload || "Failed to submit feedback");
    }
  };

  if (error && !currentFacultyProject) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-error">{error}</p>
        <Link to="/faculty" className="mt-4 text-primary hover:underline">
          Back to Faculty Portal
        </Link>
      </div>
    );
  }

  if (isLoading && !currentFacultyProject) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/faculty"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Faculty Portal
      </Link>

      {/* Full project view â€” same page the students see (read-only for faculty) */}
      <ProjectOverviewPage embedded />

      {/* Faculty-only feedback form */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
          <MessageSquare size={18} className="text-primary" />
          Submit Feedback
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {formError && (
            <p className="rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
              {formError}
            </p>
          )}
          {submitted && (
            <p className="rounded-lg border border-success-light bg-success-light px-3 py-2 text-sm text-success">
              Feedback submitted.
            </p>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your feedback on the project's progress..."
            rows={4}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              Rating
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} â€” {["Poor", "Fair", "Good", "Very Good", "Excellent"][r - 1]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyProjectPage;

