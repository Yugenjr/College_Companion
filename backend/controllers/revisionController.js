import { generateJSONCompletion } from '../services/groqService.js';
import RevisionPlan from '../models/RevisionPlan.js';

/**
 * @route   POST /api/revision/generate
 * @desc    Generate revision strategy based on syllabus and preferences
 * @access  Protected
 */
export const generateRevisionPlan = async (req, res) => {
  try {
    const { userId, syllabusText, preferences } = req.body;

    if (!userId || !syllabusText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId and syllabusText are required',
      });
    }

    const systemPrompt = `You are an expert revision strategist. Create effective revision plans that maximize retention and exam performance.

Rules:
1. Break down the syllabus into weekly revision schedules
2. Use spaced repetition principles
3. Include active recall techniques
4. Provide study tips specific to the content
5. Return structured JSON format`;

    const userPrompt = `Create a revision plan:

Syllabus:
${syllabusText}

Preferences:
${JSON.stringify(preferences, null, 2)}

Return JSON in this format:
{
  "weeks": [
    {
      "weekNumber": 1,
      "topics": ["Topic 1", "Topic 2"],
      "dailySchedule": [
        {"day": "Monday", "tasks": ["Review notes", "Practice problems"], "duration": "2 hours"}
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2"]
}`;

    const plan = await generateJSONCompletion(systemPrompt, userPrompt);

    const revisionPlan = new RevisionPlan({
      userId,
      syllabusText,
      preferences,
      plan,
    });

    await revisionPlan.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${userId}`).emit('notification:receive', {
        type: 'revision',
        title: 'Revision Plan Ready',
        body: 'Your personalized revision plan has been generated.',
        data: plan,
        source: 'revision',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send revision notification:', notifyError.message);
    }

    res.json({
      success: true,
      plan,
      planId: revisionPlan._id,
    });
  } catch (error) {
    console.error('❌ Generate revision plan error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate revision plan',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/revision/history?userId=xxx
 * @desc    Get user's revision plan history
 * @access  Protected
 */
export const getRevisionHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const plans = await RevisionPlan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-syllabusText -__v');

    res.json({
      success: true,
      plans,
      count: plans.length,
    });
  } catch (error) {
    console.error('❌ Get revision history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  generateRevisionPlan,
  getRevisionHistory,
};
