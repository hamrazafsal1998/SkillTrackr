const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  icon: {
    type: String,
    required: true,
    enum: ['keyboard', 'dumbbell', 'brush', 'music', 'book', 'code', 'camera', 'gamepad', 'other'],
    default: 'other'
  },
  startingLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  currentLevel: {
    type: Number,
    default: function() { return this.startingLevel; },
    min: 1,
    max: 10
  },
  mainGoal: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  targetDate: {
    type: Date,
    required: true
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update progress percentage based on level change
skillSchema.methods.updateProgress = function() {
  const totalLevels = 10 - this.startingLevel;
  const levelsGained = this.currentLevel - this.startingLevel;
  this.progressPercentage = totalLevels > 0 ? Math.round((levelsGained / totalLevels) * 100) : 100;
  this.updatedAt = new Date();
};

module.exports = mongoose.model('Skill', skillSchema);
