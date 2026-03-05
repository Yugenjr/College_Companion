import { generateJSONCompletion } from '../services/groqService.js';
import RevisionPlan from '../models/RevisionPlan.js';
import express from 'express';

const router = express.Router();

/**
 * Utility: Parse syllabus into topics
 * @param {string} syllabus
 * @returns {string[]}
 */
function extractTopics(syllabus) {
  return syllabus
    .split(/\n|:/)
    .map(t => t.trim())
    .filter(t => t.length > 3 && !/^\d+$/.test(t));
}

/**
 * Utility: Build a flexible revision schedule
 * @param {string[]} topics
 * @param {Object} preferences
 * @returns {Object}
 */
function buildRevisionSchedule(topics, preferences) {
  const weeks = [];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const totalWeeks = preferences.totalWeeks || Math.ceil(topics.length / (preferences.topicsPerWeek || 3));
  let topicIdx = 0;
  for (let w = 1; w <= totalWeeks; w++) {
    const weekTopics = topics.slice(topicIdx, topicIdx + (preferences.topicsPerWeek || 3));
    topicIdx += (preferences.topicsPerWeek || 3);
    const dailySchedule = daysOfWeek.map(day => ({
      day,
      tasks: [
        `Review notes for ${weekTopics.join(', ')}`,
        'Practice problems',
        preferences.activeRecall ? 'Active recall session' : 'Summary review',
      ],
      duration: preferences.dailyDuration || '2 hours',
    }));
    weeks.push({ weekNumber: w, topics: weekTopics, dailySchedule });
  }
  return weeks;
}

/**
 * Utility: Generate study tips
 * @param {Object} preferences
 * @returns {string[]}
 */
function generateTips(preferences) {
  const tips = [
    'Use spaced repetition for better retention.',
    'Take regular breaks to avoid burnout.',
    'Practice active recall by testing yourself.',
    'Summarize each topic after studying.',
    'Review mistakes and focus on weak areas.',
  ];
  if (preferences.groupStudy) tips.push('Organize group study sessions for collaborative learning.');
  if (preferences.examDate) tips.push(`Plan revision to finish before your exam on ${preferences.examDate}.`);
  return tips;
}

/**
 * @route   POST /api/revision/generate
 * @desc    Generate a flexible revision schedule
 * @access  Protected
 */
router.post('/revision/generate', async (req, res) => {
  try {
    const { userId, syllabusText, preferences = {} } = req.body;
    if (!userId || !syllabusText) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const topics = extractTopics(syllabusText);
    const weeks = buildRevisionSchedule(topics, preferences);
    const tips = generateTips(preferences);
    const plan = { weeks, tips };
    // Save to DB
    const revisionPlan = new RevisionPlan({ userId, syllabusText, preferences, plan });
    await revisionPlan.save();
    res.json({ success: true, plan, planId: revisionPlan._id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate revision plan', message: error.message });
  }
});

/**
 * @route   GET /api/revision/history
 * @desc    Get user's revision plan history
 * @access  Protected
 */
router.get('/revision/history', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId parameter' });
    }
    const plans = await RevisionPlan.find({ userId }).sort({ createdAt: -1 }).limit(20).select('-syllabusText -__v');
    res.json({ success: true, plans, count: plans.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history', message: error.message });
  }
});

/**
 * @route   POST /api/revision/customize
 * @desc    Customize an existing revision plan
 * @access  Protected
 */
router.post('/revision/customize', async (req, res) => {
  try {
    const { planId, preferences } = req.body;
    if (!planId || !preferences) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const revisionPlan = await RevisionPlan.findById(planId);
    if (!revisionPlan) {
      return res.status(404).json({ success: false, error: 'Revision plan not found' });
    }
    const topics = extractTopics(revisionPlan.syllabusText);
    const weeks = buildRevisionSchedule(topics, preferences);
    const tips = generateTips(preferences);
    revisionPlan.preferences = preferences;
    revisionPlan.plan = { weeks, tips };
    await revisionPlan.save();
    res.json({ success: true, plan: revisionPlan.plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to customize revision plan', message: error.message });
  }
});

/**
 * @route   GET /api/revision/plan/:id
 * @desc    Get a specific revision plan
 * @access  Protected
 */
router.get('/revision/plan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await RevisionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Revision plan not found' });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch revision plan', message: error.message });
  }
});

/**
 * @route   DELETE /api/revision/plan/:id
 * @desc    Delete a revision plan
 * @access  Protected
 */
router.delete('/revision/plan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RevisionPlan.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Revision plan not found' });
    }
    res.json({ success: true, message: 'Revision plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete revision plan', message: error.message });
  }
});

/**
 * @route   POST /api/revision/manual-add
 * @desc    Manually add a revision plan
 * @access  Protected
 */
router.post('/revision/manual-add', async (req, res) => {
  try {
    const { userId, syllabusText, preferences, plan } = req.body;
    if (!userId || !syllabusText || !plan) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const revisionPlan = new RevisionPlan({ userId, syllabusText, preferences, plan });
    await revisionPlan.save();
    res.json({ success: true, planId: revisionPlan._id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add revision plan', message: error.message });
  }
});

export default router;
