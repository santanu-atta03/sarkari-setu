const mongoose = require('mongoose');

const jobExtractionTaskSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  resultData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('JobExtractionTask', jobExtractionTaskSchema);
