const express = require('express');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all skills for user
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single skill
router.get('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create skill
router.post('/', auth, [
  body('name').isLength({ min: 1, max: 100 }).trim().notEmpty(),
  body('icon').isIn(['keyboard', 'dumbbell', 'brush', 'music', 'book', 'code', 'camera', 'gamepad', 'other']),
  body('startingLevel').isInt({ min: 1, max: 10 }).toInt(),
  body('mainGoal').isLength({ min: 1, max: 500 }).trim().notEmpty(),
  body('targetDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, icon, startingLevel, mainGoal, targetDate } = req.body;

    const skill = new Skill({
      user: req.user._id,
      name,
      icon,
      startingLevel: parseInt(startingLevel),
      mainGoal,
      targetDate: new Date(targetDate)
    });

    skill.updateProgress();
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update skill
router.put('/:id', auth, [
  body('name').optional().isLength({ min: 1, max: 100 }).trim(),
  body('icon').optional().isIn(['keyboard', 'dumbbell', 'brush', 'music', 'book', 'code', 'camera', 'gamepad', 'other']),
  body('mainGoal').optional().isLength({ min: 1, max: 500 }).trim(),
  body('targetDate').optional().isISO8601(),
  body('isCompleted').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.icon) updates.icon = req.body.icon;
    if (req.body.mainGoal) updates.mainGoal = req.body.mainGoal;
    if (req.body.targetDate) updates.targetDate = new Date(req.body.targetDate);
    if (req.body.isCompleted !== undefined) updates.isCompleted = req.body.isCompleted;

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.updateProgress();
    await skill.save();

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
