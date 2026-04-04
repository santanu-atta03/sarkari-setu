/**
 * Server Entry Point — SarkariSetu Backend
 *
 * Loads environment variables, connects to MongoDB, then starts the HTTP server.
 * Handles graceful shutdown on SIGTERM / SIGINT.
 */

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const scraperService = require('./src/services/scraper/ScraperService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] SarkariSetu API running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`[Server] Health: http://localhost:${PORT}/health`);

    // ─── Scraper Service ─────────────────────────────────────────────────────
    // Start scheduler for periodically fetching government jobs
    try {
      scraperService.schedule();
      console.log('[Server] Job scraper service initialized successfully');
    } catch (err) {
      console.error('[Server] Failed to initialize job scraper:', err.message);
    }
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────────

  const shutdown = (signal) => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('[Server] MongoDB connection closed. Bye!');
      process.exit(0);
    });

    // Force exit after 10 seconds if still not shut down
    setTimeout(() => {
      console.error('[Server] Forced exit after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('[Server] Unhandled rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
