import express from "express";
const router = express.Router();

//controllers
import { signupUser, loginUser, getUsers } from "../controllers/userController.js";

//Login Route
router.post("/login", loginUser);
//Sign Up Route
router.post("/signup", signupUser);
//Sign Up Route
router.get("/login", getUsers);

export default router;
//
