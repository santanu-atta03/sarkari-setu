/**
 * Express Application Setup — SarkariSetu Backend
 *
 * Configures all middleware, routes, and error handlers.
 * Intentionally separated from server.js so tests can import the app
 * without starting an HTTP listener.
 */

require('express-async-errors'); // patches async errors into express error handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Routes
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const scraperRoutes = require('./routes/scraperRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const engagementRoutes = require('./routes/engagementRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const jobExtractRoutes = require('./routes/jobExtractRoutes');

// Error handlers
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

// Helmet sets sensible security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — allow the Next.js frontend and any configured client URL
const isProd = process.env.NODE_ENV === 'production';
const configClientURL = process.env.CLIENT_URL || '';
const clientOrigins = configClientURL.split(',').map(url => url.trim()).filter(Boolean);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://sarkarisetu-two.vercel.app', // Explicitly allow the production frontend
  ...clientOrigins,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server and same-origin requests (no origin header)
    if (!origin || allowedOrigins.includes(origin) || (!isProd && origin.startsWith('http://localhost:'))) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — applies to all /api/* routes
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  max:       parseInt(process.env.RATE_LIMIT_MAX, 10)        || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
  skip: (req) => process.env.NODE_ENV === 'test', // skip in tests
});

app.use('/api', apiLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Sanitize user-supplied MongoDB query operators ($, .) in req.body / req.query
app.use(mongoSanitize());

// ─── Logging ──────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/extract', jobExtractRoutes);

// ─── 404 + Global Error Handler ───────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

module.exports = app;
