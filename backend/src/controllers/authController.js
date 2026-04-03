/**
 * Auth Controller — Admin Login / Profile
 */

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Validates credentials and returns a signed JWT.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Explicitly select password (it's excluded by default)
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !admin.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Update last login timestamp
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = admin.generateJWT();

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

/**
 * GET /api/auth/me
 * Returns the authenticated admin's profile.
 */
exports.getMe = async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

  return res.json({ success: true, data: admin });
};

/**
 * POST /api/auth/seed-admin
 * One-time endpoint to create the initial super admin (disabled in production).
 * Protected by a seeding secret in the request body.
 */
exports.seedAdmin = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Forbidden in production' });
  }

  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Admin already exists' });
  }

  const admin = await Admin.create({
    name: 'Super Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'super_admin',
  });

  return res.status(201).json({
    success: true,
    message: 'Super admin created',
    data: { id: admin._id, email: admin.email, role: admin.role },
  });
};
