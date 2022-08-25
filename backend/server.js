import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";

const app = express();
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
dotenv.config();

// cors to allow server to server communication without proxy
app.use(cors());

//Route Paths
app.use("/tasks", taskRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => app.listen(PORT, () => console.log(`Mongo connection is established and running on port: ${PORT}`)))
  .catch((err) => console.log(err.message));
