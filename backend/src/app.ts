import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler.js";
import v1Router from "./api/v1/index.js"; // <-- Import the main v1 router

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1", v1Router); // <-- Use the v1 router

// Error Handling Middleware
app.use(errorHandler);

export default app;
