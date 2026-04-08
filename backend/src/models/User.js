/**
 * User Mongoose Model
 *
 * Represents a public user (citizen) who can subscribe to notifications.
 * Extensively upgraded with Aspirant Profile for Auto-Eligibility matching.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
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
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
    },

    avatar: {
      type: String,
      default: '',
    },

    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      inApp: {
        type: Boolean,
        default: true,
      },
      categories: {
        type: [String],
        default: [],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // ── Aspirant Profile (For Auto-Eligibility Matching) ──
    profile: {
      dob: { type: Date, default: null },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: '',
      },
      category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS', ''],
        default: '',
      },
      qualification: {
        type: String,
        enum: [
          '8th Pass',
          '10th Pass',
          '12th Pass',
          'Diploma',
          'Graduate',
          'Post Graduate',
          'PhD',
          'Any',
          '',
        ],
        default: '',
      },
      state: { type: String, trim: true, default: '' },
      physicalStats: {
        heightCm: { type: Number, default: null },
        weightKg: { type: Number, default: null },
      },
    },

    // ── My Applications Track (Exam Tracker) ──
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        applicationNumber: {
          type: String, // Optional user-input application number
          trim: true,
        },
        // To track a custom status if needed, but dates are pulled from the Job itself
        customStatus: {
          type: String,
          enum: ['Applied', 'Admit Card Downloaded', 'Exam Taken', 'Result Checked'],
          default: 'Applied',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
