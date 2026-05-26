import { generateQuestions as generateQuestionsAI } from '../services/groqService.js';
import User from '../models/User.js';

/**
 * POST /api/questions/generate
 * Generate questions and save to user's questionHistory
 */
export const generateQuestions = async (req, res) => {
  try {
    const { uid } = req.user; // From Firebase token
    const { syllabus, questionType } = req.body;

    if (!syllabus || !questionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: syllabus, questionType',
        code: 400
      });
    }

    console.log(`🎯 Generating ${questionType} questions for user ${uid}...`);

    // Generate questions using Groq
    const result = await generateQuestionsAI(syllabus, questionType);

    // Find or create user
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({
        _id: uid,
        profile: { email: req.user.email }
      });
    }

    // Save to questionHistory
    user.questionHistory.push({
      syllabus,
      questionType,
      questions: result.questions,
      generatedAt: new Date()
    });

    user.updatedAt = new Date();
    await user.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${uid}`).emit('notification:receive', {
        type: 'questions',
        title: 'Questions Generated',
        body: `Your ${questionType} questions have been generated and saved to your history.`,
        data: result.questions,
        source: 'questions',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send questions notification:', notifyError.message);
    }

    res.json({
      success: true,
      questions: result.questions,
      savedToHistory: true
    });

  } catch (error) {
    console.error('❌ Question generation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
      details: error.message,
      code: 500
    });
  }
};

export default { generateQuestions };
