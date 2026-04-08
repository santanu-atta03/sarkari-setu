const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    default: 'Daily 5-Min Quiz'
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number, // Index of the correct option
      required: true
    },
    explanation: String
  }]
}, { timestamps: true });

quizSchema.index({ date: -1 });

module.exports = mongoose.model('Quiz', quizSchema);
