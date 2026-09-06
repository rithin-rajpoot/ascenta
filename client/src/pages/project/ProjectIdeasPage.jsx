import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, Lightbulb } from "lucide-react";
import { generateProjectIdeas } from "../../services/aiService";

function ProjectIdeasPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    domain: "",
    technologies: "",
    difficulty: "Intermediate",
    interests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateProjectIdeas(formData);
      setIdeas(response.data.ideas || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate ideas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIdea = (idea) => {
    // Pass the selected idea to the blueprint page
    navigate("/project/blueprint", { state: { initialIdea: idea, preferences: formData } });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/project/setup"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
        {/* Left side: Form */}
        <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-sm md:w-1/2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <Sparkles size={20} className="text-primary" />
            Project Preferences
          </h2>
          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Domain <span className="text-text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                name="domain"
                placeholder="e.g. Healthcare, Education, FinTech"
                value={formData.domain}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Preferred Technologies <span className="text-text-muted">(Optional)</span>
              </label>
              <input
                type="text"
                name="technologies"
                placeholder="e.g. React, Python, Machine Learning"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Specific Interests <span className="text-text-muted">(Optional)</span>
              </label>
              <textarea
                name="interests"
                rows="2"
                placeholder="e.g. I want to build something that helps the environment..."
                value={formData.interests}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:bg-primary/70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isLoading ? "Generating Ideas..." : "Generate Ideas"}
            </button>
          </form>
        </div>

        {/* Right side: Results */}
        <div className="w-full md:w-1/2">
          {ideas.length === 0 && !isLoading ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-text-secondary">
              <Lightbulb size={32} className="mb-4 text-text-muted" />
              <p>Fill out your preferences and click Generate to see AI-suggested project ideas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary">Suggested Ideas</h3>
              {ideas.map((idea, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary">
                  <h4 className="font-semibold text-text-primary">{idea.title}</h4>
                  <p className="mt-2 text-sm text-text-secondary">{idea.description}</p>
                  <button
                    onClick={() => handleSelectIdea(idea)}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Select Idea →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectIdeasPage;
