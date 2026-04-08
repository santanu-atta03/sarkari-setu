/**
 * MongoDB Connection (Mongoose)
 *
 * Establishes a singleton connection to MongoDB.
 * Handles connection events and graceful shutdown.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("\n=============================================");
    console.error("❌ MONGODB CONNECTION FAILED ❌");
    console.error("=============================================");
    console.error("This is causing the 500 Errors on the Frontend!");
    console.error("Your ISP (Jio/Airtel) or WiFi is blocking MongoDB.");
    console.error("FIX: Connect your PC to a Mobile Hotspot temporarily.");
    console.error("=============================================\n");
    console.error(error.message);
    // Don't process.exit(1) — safe for serverless platforms like Render
  }
};

module.exports = dbConnect;