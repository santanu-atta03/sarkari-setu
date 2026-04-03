/**
 * Admin Mongoose Model
 *
 * Represents an admin user who can manage job postings on SarkariSetu.
 * Passwords are hashed with bcrypt. JWT utilities are included.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },

    role: {
      type: String,
      enum: ['super_admin', 'editor'],
      default: 'editor',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: Hash password ───────────────────────────────────────────────────

AdminSchema.pre('save', async function (next) {
  // Only hash when password is new or modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Track when password was changed
  this.passwordChangedAt = new Date();
  next();
});

// ─── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Compare a plain-text password against the stored hash
 */
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate a signed JWT for this admin
 */
AdminSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Check if JWT was issued before a password change (invalidation)
 */
AdminSchema.methods.isJWTValid = function (jwtIssuedAt) {
  if (!this.passwordChangedAt) return true;
  return jwtIssuedAt >= Math.floor(this.passwordChangedAt.getTime() / 1000);
};

module.exports = mongoose.model('Admin', AdminSchema);
