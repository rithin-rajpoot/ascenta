import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDB() {
  if (!config.mongodbUri) {
    console.warn(
      "⚠️  MONGODB_URI is not set. MongoDB connection skipped. " +
        "Copy server/.env.example to server/.env and set MONGODB_URI."
    );
    return;
  }

  try {
    await mongoose.connect(config.mongodbUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed.");
    console.error("   Reason:", error.message);
    console.error(
      "   Check that MONGODB_URI in server/.env is correct and MongoDB Atlas allows connections from your IP."
    );
  }
}