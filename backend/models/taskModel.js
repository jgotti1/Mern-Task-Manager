import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskManagerSchema = new Schema(
  {
    assignTo: {
      type: String,
      required: false,
    },
    assignedBy: {
      type: String,
      required: false,
    },
    caseName: {
      type: String,
      required: false,
      default: "N/A",
    },
    task: {
      type: String,
      required: false,
    },
    dueDate: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      required: false,
    },

    completed: {
      type: String,
      default: "NO",
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const TaskManager = mongoose.model("TaskManager", taskManagerSchema);

export default TaskManager;
