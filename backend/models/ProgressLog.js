const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update skill's current level when progress log is saved
progressLogSchema.post('save', async function() {
  const Skill = mongoose.model('Skill');
  const skill = await Skill.findById(this.skill);
  if (skill && this.level > skill.currentLevel) {
    skill.currentLevel = this.level;
    skill.updateProgress();
    await skill.save();
  }
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);
