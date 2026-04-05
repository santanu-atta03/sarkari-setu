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
const trendingService = require('./src/services/trendingService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] SarkariSetu API running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`[Server] Health: http://localhost:${PORT}/health`);

    try {
      scraperService.schedule();
      console.log('[Server] Job scraper service initialized successfully');
    } catch (err) {
      console.error('[Server] Failed to initialize job scraper:', err.message);
    }

    // ─── Trending Score Refresher ───────────────────────────────────────────
    // Periodically update scores to account for time-decay gravity.
    // Recommended: Every 4 to 6 hours.
    const trendingInterval = parseInt(process.env.TRENDING_RECALC_INTERVAL_MS, 10) || 4 * 60 * 60 * 1000;
    setInterval(async () => {
      try {
        await trendingService.recalculateAllScores();
      } catch (err) {
        console.error('[Server] Trending score recalculation failed:', err.message);
      }
    }, trendingInterval);

    // Initial run after server starts
    setTimeout(() => {
      trendingService.recalculateAllScores().catch(console.error);
    }, 10_000);
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
