const express = require('express');
const { body, validationResult } = require('express-validator');
const ProgressLog = require('../models/ProgressLog');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get progress logs for a skill
router.get('/:skillId', auth, async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.skillId, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const progressLogs = await ProgressLog.find({ skill: req.params.skillId })
      .sort({ date: -1 });

    res.json(progressLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add progress log
router.post('/:skillId', auth, upload.single('image'), [
  body('level').isInt({ min: 1, max: 10 }),
  body('description').isLength({ min: 1, max: 1000 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = await Skill.findOne({ _id: req.params.skillId, user: req.user._id });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { level, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const progressLog = new ProgressLog({
      skill: req.params.skillId,
      user: req.user._id,
      level: parseInt(level),
      description,
      image
    });

    await progressLog.save();

    // Refresh skill to get updated level
    await skill.save();

    res.status(201).json(progressLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress log
router.put('/:id', auth, upload.single('image'), [
  body('level').optional().isInt({ min: 1, max: 10 }),
  body('description').optional().isLength({ min: 1, max: 1000 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    if (req.body.level) updates.level = parseInt(req.body.level);
    if (req.body.description) updates.description = req.body.description;
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const progressLog = await ProgressLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    if (!progressLog) {
      return res.status(404).json({ message: 'Progress log not found' });
    }

    res.json(progressLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete progress log
router.delete('/:id', auth, async (req, res) => {
  try {
    const progressLog = await ProgressLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!progressLog) {
      return res.status(404).json({ message: 'Progress log not found' });
    }

    res.json({ message: 'Progress log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
