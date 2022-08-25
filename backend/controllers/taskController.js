import TaskManager from "../models/taskModel.js";
import mongoose from "mongoose";

// GET ALL TASKS
export const getAllTasks = async (req, res) => {
  // const user_id = req.user._id;
  const tasks = await TaskManager.find().sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// GET  A SINGLE TASK
export const getTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Task" });
  }
  const task = await TaskManager.findById(id);
  if (!task) {
    return res.status(404).json({ error: "No Such Task" });
  }
  res.status(200).json(task);
};

export const createTask = async (req, res) => {
  // *************Required fileds error handling

  const { assignTo, assignedBy, caseName, task, dueDate, priority, notes } = req.body;
  let emptyFields = [];

  if (!assignTo) {
    emptyFields.push("assignTo");
  }
  if (!assignedBy) {
    emptyFields.push("assignedBy");
  }
  // if (!caseName) {
  //   emptyFields.push("caseName");
  // }
  if (!task) {
    emptyFields.push("task");
  }
  if (!dueDate) {
    emptyFields.push("dueDate");
  }
  if (!priority) {
    emptyFields.push("priority");
  }

  // if (!notes) {
  //   emptyFields.push("notes");
  // }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all required fields", emptyFields });
  }
  // ***************add to db
  const taskData = req.body;
  const newTask = new TaskManager(taskData);
  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// DELETE A TASK
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such task" });
  }
  const task = await TaskManager.findByIdAndDelete({ _id: id });

  if (!task) {
    return res.status(404).json({ error: "No Such Task" });
  }
  res.status(200).json(task);
};
// UPDATE A TASK
export const updateTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Task" });
  }
  const task = await TaskManager.findByIdAndUpdate({ _id: id }, { ...req.body });
  if (!task) {
    return res.status(404).json({ error: "No Such Task" });
  }
  res.status(200).json(task);
};
