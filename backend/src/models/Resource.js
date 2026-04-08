const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  exam: {
    type: String,
    required: true,
    enum: ['UPSC', 'SSC CGL', 'RRB NTPC', 'IBPS', 'State PSC', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['PYQ', 'Syllabus']
  },
  year: {
    type: String, // For PYQs, e.g., '2023'
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

resourceSchema.index({ exam: 1, type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
