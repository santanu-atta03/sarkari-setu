const mongoose = require('mongoose');

const cutoffPredictionSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: true,
    enum: ['UPSC', 'SSC CGL', 'RRB NTPC', 'IBPS', 'State PSC', 'Other']
  },
  year: {
    type: String,
    required: true,
    default: new Date().getFullYear().toString()
  },
  category: { // user's category (General, OBC, SC, ST)
    type: String,
    required: true,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']
  },
  expectedMarks: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

cutoffPredictionSchema.index({ exam: 1, year: 1, category: 1 });

module.exports = mongoose.model('CutoffPrediction', cutoffPredictionSchema);
