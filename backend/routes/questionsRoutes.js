import express from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getOrCreateUser } from '../utils/userHelpers.js';

const router = express.Router();

/**
 * POST /api/questions
 * Save a generated question to user's collection
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { question, answer } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const user = await getOrCreateUser(uid, email);

    user.questionGenerator.savedQuestions.push({
      question,
      answer: answer || '',
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Question saved successfully',
      question: user.questionGenerator.savedQuestions[user.questionGenerator.savedQuestions.length - 1]
    });
  } catch (error) {
    console.error('❌ Save question error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to save question',
      message: error.message
    });
  }
});

/**
 * GET /api/questions
 * Get all saved questions for current user
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.json({
        success: true,
        questions: []
      });
    }

    res.json({
      success: true,
      questions: user.questionGenerator.savedQuestions
    });
  } catch (error) {
    console.error('❌ Get questions error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions',
      message: error.message
    });
  }
});

/**
 * DELETE /api/questions/:id
 * Delete a saved question by ID
 */
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.questionGenerator.savedQuestions = user.questionGenerator.savedQuestions.filter(
      q => q._id.toString() !== id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete question error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete question',
      message: error.message
    });
  }
});

export default router;
