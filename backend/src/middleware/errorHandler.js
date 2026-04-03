/**
 * Global Error Handler middleware
 *
 * Catches all errors passed to next(err) and formats them consistently.
 * Handles Mongoose validation errors, duplicate key errors, and cast errors
 * so controllers don't need to handle them individually.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // ── Mongoose Validation Error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── Mongoose Duplicate Key ────────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `A record with that ${field} already exists.`;
    errors = [{ field, message }];
  }

  // ── Mongoose Cast Error (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // ── JWT Errors (shouldn't reach here normally, handled in middleware) ─────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Hide stack traces in production
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(stack && { stack }),
  });
};

/**
 * 404 handler — catches requests that don't match any route.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
