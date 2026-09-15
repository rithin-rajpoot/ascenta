import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Recipient of the notification.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["team_invite", "task_assigned", "milestone_deadline", "faculty_feedback"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Notification title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Notification message cannot exceed 500 characters"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    // Optional frontend path the notification navigates to.
    link: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);