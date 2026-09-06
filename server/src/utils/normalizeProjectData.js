// Normalizes free-form blueprint payloads (including AI-generated and manually
// edited data) into the shapes expected by the Project model.
//
// - Accepts comma-separated strings OR arrays for string-list fields.
// - Drops empty / whitespace-only entries so a malformed AI response cannot
//   corrupt the saved blueprint.
// - Coerces `features` (array of strings or { name, isCore }) and
//   `sdgs` (array of strings or { goal, reason, impact }) to document form.
// - Fields that are absent (undefined / null) are left untouched so updates
//   do not wipe values the client did not intend to change.

const toStringArray = (value) => {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    return value.map((v) => (v ? String(v).trim() : "")).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const normalizeFeatures = (features) => {
  if (features == null) return undefined;
  if (!Array.isArray(features)) return [];
  return features
    .map((feature) => {
      if (typeof feature === "string") {
        const name = feature.trim();
        return name ? { name, isCore: true } : null;
      }
      if (feature && typeof feature === "object") {
        const name = feature.name ? String(feature.name).trim() : "";
        if (!name) return null;
        const normalized = { name, isCore: feature.isCore !== false };
        if (feature._id) normalized._id = feature._id;
        return normalized;
      }
      return null;
    })
    .filter(Boolean);
};

const normalizeSdgs = (sdgs) => {
  if (sdgs == null) return undefined;
  if (!Array.isArray(sdgs)) return [];
  return sdgs
    .map((sdg) => {
      if (typeof sdg === "string") {
        const goal = sdg.trim();
        return goal ? { goal, reason: "", impact: "" } : null;
      }
      if (sdg && typeof sdg === "object") {
        const goal = sdg.goal ? String(sdg.goal).trim() : "";
        if (!goal) return null;
        const normalized = { goal };
        if (sdg.reason != null) normalized.reason = String(sdg.reason);
        if (sdg.impact != null) normalized.impact = String(sdg.impact);
        if (sdg._id) normalized._id = sdg._id;
        return normalized;
      }
      return null;
    })
    .filter(Boolean);
};

export const normalizeProjectData = (data) => {
  if (!data || typeof data !== "object") return data;

  const normalized = { ...data };
  normalized.objectives = toStringArray(data.objectives);
  normalized.targetUsers = toStringArray(data.targetUsers);
  normalized.technologies = toStringArray(data.technologies);
  normalized.features = normalizeFeatures(data.features);
  normalized.sdgs = normalizeSdgs(data.sdgs);
  return normalized;
};

export default normalizeProjectData;