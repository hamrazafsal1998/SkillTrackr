const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const ProgressLog = require('../models/ProgressLog');

const router = express.Router();

// Get public portfolio
router.get('/:username/:skillName', async (req, res) => {
  try {
    const { username, skillName } = req.params;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find skill by name and user
    const skill = await Skill.findOne({
      user: user._id,
      name: { $regex: new RegExp(`^${skillName}$`, 'i') }
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Get progress logs
    const progressLogs = await ProgressLog.find({ skill: skill._id })
      .sort({ date: 1 });

    // Calculate days left
    const today = new Date();
    const targetDate = new Date(skill.targetDate);
    const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      user: {
        username: user.username,
        bio: user.bio,
        avatar: user.avatar
      },
      skill: {
        name: skill.name,
        icon: skill.icon,
        startingLevel: skill.startingLevel,
        currentLevel: skill.currentLevel,
        mainGoal: skill.mainGoal,
        targetDate: skill.targetDate,
        progressPercentage: skill.progressPercentage,
        isCompleted: skill.isCompleted,
        daysLeft: daysLeft > 0 ? daysLeft : 0
      },
      progressLogs: progressLogs.map(log => ({
        id: log._id,
        level: log.level,
        description: log.description,
        image: log.image,
        date: log.date
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
