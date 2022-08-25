import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

//controllers
import { getAllTasks, getTask, createTask, deleteTask, updateTask } from "../controllers/taskController.js";

// require auth for all routes
router.use(requireAuth);

//Get all
router.get("/", getAllTasks);
//Get single
router.get("/:id", getTask);
//Post new
router.post("/", createTask);

//Delete
router.delete("/:id", deleteTask);

//Update
router.patch("/:id", updateTask);

export default router;
