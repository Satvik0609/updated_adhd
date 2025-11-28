import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    reminderDate: Date,
    reminderSent: { type: Boolean, default: false },
    recurring: {
      enabled: { type: Boolean, default: false },
      pattern: { type: String, enum: ["daily", "weekly", "monthly"], default: "daily" },
      nextDue: Date,
    },
    category: String,
    notes: String,
  },
  { timestamps: true }
);

TaskSchema.index({ user: 1, completed: 1, createdAt: -1 });
TaskSchema.index({ user: 1, reminderDate: 1 });
TaskSchema.index({ user: 1, "recurring.nextDue": 1 });

const Task = mongoose.model("Task", TaskSchema);
export default Task;

