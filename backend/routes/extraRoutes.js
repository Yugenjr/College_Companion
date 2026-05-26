import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Note from '../models/Note.js';
import SurvivalPlan from '../models/SurvivalPlan.js';

const router = express.Router();

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback for College Companion
 * @access  Protected
 */
router.post(
  '/feedback',
  [
    body('userId').notEmpty().withMessage('userId is required'),
    body('message').isLength({ min: 10 }).withMessage('Feedback message must be at least 10 characters'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { userId, message, rating } = req.body;
      // Simulate saving feedback (replace with DB logic)
      const feedback = { userId, message, rating, submittedAt: new Date() };
      // ...existing code to save feedback...
      res.status(201).json({ success: true, feedback });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to submit feedback', message: error.message });
    }
  }
);

/**
 * @route   GET /api/notes/search
 * @desc    Search notes by keyword
 * @access  Protected
 */
router.get('/notes/search', async (req, res) => {
  try {
    const { userId, keyword } = req.query;
    if (!userId || !keyword) {
      return res.status(400).json({ success: false, error: 'userId and keyword required' });
    }
    const notes = await Note.find({ userId, $text: { $search: keyword } }).select('-__v');
    res.json({ success: true, notes, count: notes.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search notes', message: error.message });
  }
});

/**
 * @route   POST /api/users/bulk-create
 * @desc    Bulk create users
 * @access  Admin
 */
router.post('/users/bulk-create', async (req, res) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ success: false, error: 'users array required' });
    }
    const created = [];
    for (const userData of users) {
      if (!userData.uid || !userData.email) continue;
      const user = new User(userData);
      await user.save();
      created.push(user);
    }
    res.status(201).json({ success: true, created, count: created.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Bulk user creation failed', message: error.message });
  }
});

/**
 * @route   GET /api/survival/plan/:id
 * @desc    Get survival plan by ID
 * @access  Protected
 */
router.get('/survival/plan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SurvivalPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Survival plan not found' });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch survival plan', message: error.message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Protected
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user', message: error.message });
  }
});

/**
 * @route   DELETE /api/notes/bulk-delete
 * @desc    Bulk delete notes by IDs
 * @access  Protected
 */
router.delete('/notes/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array required' });
    }
    const result = await Note.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Bulk note deletion failed', message: error.message });
  }
});

export default router;
