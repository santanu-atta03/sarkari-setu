const mongoose = require('mongoose');

const currentAffairSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['National', 'International', 'Sports', 'Economy', 'Science', 'Other'],
    default: 'National'
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  sourceUrl: {
    type: String
  },
  imageUrl: {
    type: String
  }
}, { timestamps: true });

currentAffairSchema.index({ date: -1 });

module.exports = mongoose.model('CurrentAffair', currentAffairSchema);
