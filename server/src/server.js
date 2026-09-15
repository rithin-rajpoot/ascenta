import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config, validateEnv } from "./config/env.js";

const startServer = async () => {
  validateEnv();
  await connectDB();

  app.listen(config.port, () => {
    console.log(`🚀 Ascenta backend running at http://localhost:${config.port}`);
    console.log(`   Health check: http://localhost:${config.port}/api/health`);
    console.log(`   Environment: ${config.nodeEnv}`);
  });
};

startServer();