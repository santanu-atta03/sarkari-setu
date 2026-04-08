const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allowing anonymous reports, optionally
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false // Might be a general report e.g., missing job
  },
  reportType: {
    type: String,
    enum: ['Exam Extended', 'Missing Job', 'Typo/Error', 'Syllabus Doubt', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Index for admin searching/filtering pending reports easily
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
