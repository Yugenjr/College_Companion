// Robust Error Handling & Code Structure Example
// This file demonstrates best practices for async functions, error handling, ES6 modules, and maintainable code.

import express from 'express';
import User from '../models/User.js';
import Note from '../models/Note.js';
import SurvivalPlan from '../models/SurvivalPlan.js';
import RevisionPlan from '../models/RevisionPlan.js';

const router = express.Router();

// Utility: Centralized error handler
function handleError(res, error, message = 'Internal server error', status = 500) {
  console.error(`❌ ${message}:`, error.message);
  res.status(status).json({ success: false, error: message, details: error.message });
}

// Utility: Validate required fields
function validateFields(obj, fields) {
  const missing = fields.filter(f => !obj[f]);
  return missing.length ? `Missing required fields: ${missing.join(', ')}` : null;
}

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Protected
 */
router.post('/users', async (req, res) => {
  try {
    const errorMsg = validateFields(req.body, ['uid', 'email']);
    if (errorMsg) return res.status(400).json({ success: false, error: errorMsg });
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    handleError(res, error, 'Failed to create user');
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user');
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected
 */
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    handleError(res, error, 'Failed to update user');
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    handleError(res, error, 'Failed to delete user');
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a note
 * @access  Protected
 */
router.post('/notes', async (req, res) => {
  try {
    const errorMsg = validateFields(req.body, ['userId', 'title', 'content']);
    if (errorMsg) return res.status(400).json({ success: false, error: errorMsg });
    const note = new Note(req.body);
    await note.save();
    res.status(201).json({ success: true, note });
  } catch (error) {
    handleError(res, error, 'Failed to create note');
  }
});

/**
 * @route   GET /api/notes/:id
 * @desc    Get note by ID
 * @access  Protected
 */
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, note });
  } catch (error) {
    handleError(res, error, 'Failed to fetch note');
  }
});

/**
 * @route   PUT /api/notes/:id
 * @desc    Update note
 * @access  Protected
 */
router.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, note });
  } catch (error) {
    handleError(res, error, 'Failed to update note');
  }
});

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete note
 * @access  Protected
 */
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    handleError(res, error, 'Failed to delete note');
  }
});

/**
 * @route   POST /api/survival-plan
 * @desc    Create survival plan
 * @access  Protected
 */
router.post('/survival-plan', async (req, res) => {
  try {
    const errorMsg = validateFields(req.body, ['userId', 'skills', 'goals']);
    if (errorMsg) return res.status(400).json({ success: false, error: errorMsg });
    const plan = new SurvivalPlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to create survival plan');
  }
});

/**
 * @route   GET /api/survival-plan/:id
 * @desc    Get survival plan by ID
 * @access  Protected
 */
router.get('/survival-plan/:id', async (req, res) => {
  try {
    const plan = await SurvivalPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Survival plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to fetch survival plan');
  }
});

/**
 * @route   PUT /api/survival-plan/:id
 * @desc    Update survival plan
 * @access  Protected
 */
router.put('/survival-plan/:id', async (req, res) => {
  try {
    const plan = await SurvivalPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, error: 'Survival plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to update survival plan');
  }
});

/**
 * @route   DELETE /api/survival-plan/:id
 * @desc    Delete survival plan
 * @access  Protected
 */
router.delete('/survival-plan/:id', async (req, res) => {
  try {
    const plan = await SurvivalPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Survival plan not found' });
    res.json({ success: true, message: 'Survival plan deleted' });
  } catch (error) {
    handleError(res, error, 'Failed to delete survival plan');
  }
});

/**
 * @route   POST /api/revision-plan
 * @desc    Create revision plan
 * @access  Protected
 */
router.post('/revision-plan', async (req, res) => {
  try {
    const errorMsg = validateFields(req.body, ['userId', 'syllabusText']);
    if (errorMsg) return res.status(400).json({ success: false, error: errorMsg });
    const plan = new RevisionPlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to create revision plan');
  }
});

/**
 * @route   GET /api/revision-plan/:id
 * @desc    Get revision plan by ID
 * @access  Protected
 */
router.get('/revision-plan/:id', async (req, res) => {
  try {
    const plan = await RevisionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Revision plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to fetch revision plan');
  }
});

/**
 * @route   PUT /api/revision-plan/:id
 * @desc    Update revision plan
 * @access  Protected
 */
router.put('/revision-plan/:id', async (req, res) => {
  try {
    const plan = await RevisionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, error: 'Revision plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    handleError(res, error, 'Failed to update revision plan');
  }
});

/**
 * @route   DELETE /api/revision-plan/:id
 * @desc    Delete revision plan
 * @access  Protected
 */
router.delete('/revision-plan/:id', async (req, res) => {
  try {
    const plan = await RevisionPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, error: 'Revision plan not found' });
    res.json({ success: true, message: 'Revision plan deleted' });
  } catch (error) {
    handleError(res, error, 'Failed to delete revision plan');
  }
});

export default router;
