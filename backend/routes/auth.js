const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', [
  body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    console.log('Signup request received:', { 
      body: req.body, 
      headers: { 'content-type': req.get('content-type') } 
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create and save user
    const user = new User({ username, email, password });
    await user.save();
    console.log('User created:', user._id);

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
});

// Register (alias for signup)
router.post('/register', [
  body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create and save user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'ALL FIELDS ARE REQUIRED' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/profile', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      bio: req.user.bio,
      theme: req.user.theme
    }
  });
});

// Get current user (alias for profile)
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      bio: req.user.bio,
      theme: req.user.theme
    }
  });
});

// Update user profile
router.put('/profile', auth, [
  body('username').optional().isLength({ min: 3, max: 30 }).trim().isAlphanumeric(),
  body('bio').optional().isLength({ max: 500 }).trim(),
  body('theme').optional().isIn(['light', 'dark'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.theme) updates.theme = req.body.theme;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
