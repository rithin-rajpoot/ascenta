import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import createRateLimiter from "./middleware/rateLimiter.js";

const app = express();

// Behind a hosting proxy (Render) this makes req.ip the real client address,
// which the rate limiter relies on.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: config.frontendUrl,
  })
);

// Cap request bodies so a single request cannot exhaust server memory.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Slow down brute-force attempts against the credential endpoints.
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });

app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;