import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config, validateEnv } from "./config/env.js";

const startServer = async () => {
  validateEnv();
  await connectDB();

  // Bind 0.0.0.0 explicitly: hosting proxies (Render) route to $PORT, and the
  // default Express host can leave the service unreachable from the proxy.
  // Local dev is unchanged (PORT unset -> 5000).
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`🚀 Ascenta backend running at http://localhost:${config.port}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
    console.log(`   Environment: ${config.nodeEnv}`);
  });
};

startServer();