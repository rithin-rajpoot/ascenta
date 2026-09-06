import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, ArrowLeft, Loader2, Save } from "lucide-react";
import { generateProjectFeatures, generateProjectSdgs, generateProjectBlueprint } from "../../services/aiService";
import { createProject } from "../../store/slices/projectSlice";

function ProjectBlueprintPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { team } = useSelector((state) => state.team);
  const { isLoading: isSaving } = useSelector((state) => state.project);

  const initialIdea = location.state?.initialIdea || { title: "", description: "" };
  const preferences = location.state?.preferences || { domain: "", technologies: "", difficulty: "Intermediate" };
  const teamId = location.state?.teamId || null;

  const [formData, setFormData] = useState({
    title: initialIdea.title,
    description: initialIdea.description,
    domain: preferences.domain,
    technologies: preferences.technologies,
    difficulty: preferences.difficulty,
    problemStatement: "",
    objectives: [],
    scope: "",
    features: [],
    targetUsers: [],
    sdgs: [],
    methodology: "",
    expectedOutcome: "",
    futureScope: "",
  });

  const [aiLoading, setAiLoading] = useState({ features: false, sdgs: false, blueprint: false });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuggestFeatures = async () => {
    setAiLoading(prev => ({ ...prev, features: true }));
    setError(null);
    try {
      const res = await generateProjectFeatures({
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        technologies: formData.technologies,
      });
      const aiFeatures = [
        ...(res.data.coreFeatures || []).map(f => ({ name: f, isCore: true })),
        ...(res.data.optionalFeatures || []).map(f => ({ name: f, isCore: false }))
      ];
      setFormData(prev => ({ ...prev, features: aiFeatures }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate features");
    } finally {
      setAiLoading(prev => ({ ...prev, features: false }));
    }
  };

  const handleSuggestSdgs = async () => {
    setAiLoading(prev => ({ ...prev, sdgs: true }));
    setError(null);
    try {
      const res = await generateProjectSdgs({
        title: formData.title,
        description: formData.description,
      });
      setFormData(prev => ({ ...prev, sdgs: res.data.sdgs || [] }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate SDGs");
    } finally {
      setAiLoading(prev => ({ ...prev, sdgs: false }));
    }
  };

  const handleGenerateBlueprint = async () => {
    setAiLoading(prev => ({ ...prev, blueprint: true }));
    setError(null);
    try {
      const res = await generateProjectBlueprint({
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        technologies: formData.technologies,
        difficulty: formData.difficulty,
      });

      console.log("[Blueprint] Full response:", JSON.stringify(res));
      console.log("[Blueprint] res.data:", JSON.stringify(res?.data));

      setFormData(prev => {
        // Guard against array fields coming back as strings/null so the whole
        // state update can never abort (otherwise no fields populate).
        const toArray = (val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
          return [];
        };

        const bp = res?.data || {};

        return {
          ...prev,
          title: bp.title || prev.title,
          description: bp.description || prev.description,
          domain: bp.domain || prev.domain,
          technologies: Array.isArray(bp.technologies)
            ? bp.technologies.join(", ")
            : (bp.technologies || prev.technologies),
          problemStatement: bp.problemStatement || "",
          objectives: toArray(bp.objectives),
          scope: bp.scope || "",
          targetUsers: toArray(bp.targetUsers),
          methodology: bp.methodology || "",
          expectedOutcome: bp.expectedOutcome || "",
          futureScope: bp.futureScope || "",
          features: toArray(bp.features).map((f) => ({ name: f, isCore: true })),
          sdgs: toArray(bp.sdgs),
        };
      });
    } catch (err) {
      console.error("[Blueprint] Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to generate blueprint");
    } finally {
      setAiLoading(prev => ({ ...prev, blueprint: false }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }

    try {
      // transform arrays if they were string inputs or handle specifically
      const projectData = {
        ...formData,
        team: teamId || team?._id || null, // tied to the current team (or solo)
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : formData.technologies,
      };

      const resultAction = await dispatch(createProject(projectData));
      if (createProject.fulfilled.match(resultAction)) {
        navigate(`/project/${resultAction.payload._id}`);
      } else {
        setError(resultAction.payload);
      }
    } catch (err) {
      setError("Failed to save project.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          to={{ pathname: "/project/setup", state: teamId ? { teamId } : undefined }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Project
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* Main Form */}
        <div className="flex-1 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6">Project Blueprint</h2>

          {error && <div className="mb-6 rounded-lg border border-error bg-error-light px-4 py-3 text-sm text-error">{error}</div>}

          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Description *</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Difficulty</label>
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
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="Comma separated (e.g. React, Node.js)"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Structured Sections */}
            <div className="pt-4 border-t border-border">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Problem Statement</label>
              <textarea
                name="problemStatement"
                rows="3"
                value={formData.problemStatement}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Objectives</label>
              <textarea
                name="objectives"
                rows="3"
                value={Array.isArray(formData.objectives) ? formData.objectives.join('\n') : formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value.split('\n') })}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="One objective per line"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Scope</label>
              <textarea
                name="scope"
                rows="3"
                value={formData?.scope}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Target Users</label>
              <textarea
                name="targetUsers"
                rows="2"
                value={Array.isArray(formData.targetUsers) ? formData.targetUsers.join(', ') : formData.targetUsers}
                onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value.split(',').map(u => u.trim()) })}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Comma separated"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Methodology</label>
              <textarea
                name="methodology"
                rows="3"
                value={formData.methodology}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Expected Outcome</label>
              <textarea
                name="expectedOutcome"
                rows="3"
                value={formData.expectedOutcome}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Future Scope</label>
              <textarea
                name="futureScope"
                rows="3"
                value={formData.futureScope}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            {/* Features Preview */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-text-primary">Features</label>
                <button
                  onClick={handleSuggestFeatures}
                  disabled={aiLoading.features}
                  className="text-xs font-medium text-primary hover:text-primary-dark inline-flex items-center gap-1"
                >
                  {aiLoading.features ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Suggest with AI
                </button>
              </div>
              {(formData.features || []).length > 0 ? (
                <ul className="list-inside list-disc text-sm text-text-secondary">
                  {formData.features.map((f, i) => <li key={i}>{f.name} {f.isCore ? '(Core)' : '(Optional)'}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-text-muted italic">No features defined.</p>
              )}
            </div>

            {/* SDGs Preview */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-text-primary">SDG Mapping</label>
                <button
                  onClick={handleSuggestSdgs}
                  disabled={aiLoading.sdgs}
                  className="text-xs font-medium text-primary hover:text-primary-dark inline-flex items-center gap-1"
                >
                  {aiLoading.sdgs ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Map SDGs with AI
                </button>
              </div>
              {(formData.sdgs || []).length > 0 ? (
                <div className="space-y-2">
                  {formData.sdgs.map((sdg, i) => (
                    <div key={i} className="rounded border border-border p-3 text-sm">
                      <p className="font-semibold text-text-primary">{sdg.goal}</p>
                      <p className="text-text-secondary mt-1"><span className="font-medium text-text-primary">Reason:</span> {sdg.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">No SDGs mapped.</p>
              )}
            </div>

          </div>
        </div>

        {/* Sidebar: AI Tools */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="rounded-2xl border border-primary-light bg-primary-light/10 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
              <Sparkles size={20} />
            </div>
            <h3 className="mt-4 font-bold text-text-primary">AI Blueprint Generator</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Let AI generate a complete structured project blueprint based on your title and description.
            </p>
            <button
              onClick={handleGenerateBlueprint}
              disabled={aiLoading.blueprint}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
            >
              {aiLoading.blueprint ? <Loader2 size={16} className="animate-spin" /> : "Generate Full Blueprint"}
            </button>
            <p className="mt-3 text-xs text-text-muted text-center">
              This will overwrite the current sections. You can edit the generated content before saving.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProjectBlueprintPage;
