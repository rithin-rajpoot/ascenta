import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isCore: { type: Boolean, default: true },
});

const sdgSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  reason: { type: String },
  impact: { type: String },
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    domain: { type: String },
    technologies: [{ type: String }],
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    problemStatement: { type: String },
    objectives: [{ type: String }],
    scope: { type: String },
    features: [featureSchema],
    targetUsers: [{ type: String }],
    sdgs: [sdgSchema],
    methodology: { type: String },
    expectedOutcome: { type: String },
    futureScope: { type: String },
    status: {
      type: String,
      enum: ["Idea", "Planning", "Active", "Completed"],
      default: "Idea",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
