/**
 * MongoDB Connection (Mongoose)
 *
 * Establishes a singleton connection to MongoDB.
 * Handles connection events and graceful shutdown.
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[DB] MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Connection pool
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[DB] MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[DB] MongoDB reconnected');
    });

  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
