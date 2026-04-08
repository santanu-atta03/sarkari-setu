/**
 * Auth Middleware — JWT Verification
 *
 * Protects routes that require an authenticated admin.
 * Attaches `req.admin` with decoded token payload.
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

/**
 * Verifies the Bearer JWT in the Authorization header.
 * Responds with 401 on any failure.
 */
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in.';
    return res.status(401).json({ success: false, message });
  }

  // Verify admin still exists and token hasn't been invalidated by a password change
  const admin = await Admin.findById(decoded.id);
  if (!admin || !admin.isActive) {
    return res.status(401).json({ success: false, message: 'Admin account not found or disabled.' });
  }

  if (!admin.isJWTValid(decoded.iat)) {
    return res.status(401).json({
      success: false,
      message: 'Password was recently changed. Please log in again.',
    });
  }

  req.admin = { id: admin._id, email: admin.email, role: admin.role };
  return next();
};

/**
 * Role-based access control middleware.
 * Usage: restrict('super_admin') or restrict('super_admin', 'editor')
 */
exports.restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin?.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}`,
    });
  }
  return next();
};

/**
 * Verifies the Bearer JWT for public users.
 * Attaches `req.user` with decoded token payload.
 */
exports.protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in.';
    return res.status(401).json({ success: false, message });
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'User account not found or disabled.' });
  }

  req.user = { id: user._id, email: user.email, role: 'user' };
  return next();
};
