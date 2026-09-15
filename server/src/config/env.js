import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  // Shared secret for calling the internal AI service (optional in dev).
  aiServiceKey: process.env.AI_SERVICE_KEY || "",
};

/**
 * Fail fast on missing secrets in production, warn in development.
 * (PHASES.md Phase 12 - Security Review: environment variables.)
 */
export const validateEnv = () => {
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length === 0) return;

  const message = `Missing required environment variable(s): ${missing.join(", ")}`;
  if (config.nodeEnv === "production") {
    throw new Error(message);
  }
  console.warn(`[env] ${message}. The server will start, but related features will fail.`);
};
