import { generateJSONCompletion } from '../services/groqService.js';
import QuestionHistory from '../models/QuestionHistory.js';

/**
 * @route   POST /api/questions/generate
 * @desc    Generate questions based on syllabus and type
 * @access  Protected
 * 
 * Request body:
 * {
 *   syllabus: string,
 *   questionType: "2m" | "3m" | "14m" | "16m",
 *   userId: string (Firebase UID)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   questions: [{ question: string, marks: number, topic: string }]
 * }
 */
export const generateQuestions = async (req, res) => {
  try {
    const { syllabus, questionType, userId } = req.body;

    // Validation
    if (!syllabus || !questionType || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'syllabus, questionType, and userId are required',
      });
    }

    if (!['2m', '3m', '14m', '16m'].includes(questionType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question type',
        message: 'questionType must be one of: 2m, 3m, 14m, 16m',
      });
    }

    // Build prompt for Groq
    const systemPrompt = `You are an expert question paper setter for university exams. Generate questions strictly based on the provided syllabus.

Rules:
1. Generate ONLY questions for the specified mark type
2. Questions must be relevant to the syllabus topics
3. Return valid JSON array format: [{"question": "...", "marks": X, "topic": "..."}]
4. For 2m and 3m: generate 10-15 short answer questions
5. For 14m and 16m: generate 5-8 long answer/problem-solving questions
6. Ensure variety in topics covered`;

    const marksMap = { '2m': 2, '3m': 3, '14m': 14, '16m': 16 };
    const marks = marksMap[questionType];

    const userPrompt = `Generate ${questionType} questions from this syllabus:

${syllabus}

Return ONLY a JSON array of questions in this format:
[
  {
    "question": "Question text here",
    "marks": ${marks},
    "topic": "Relevant topic from syllabus"
  }
]`;

    // Call Groq API
    const response = await generateJSONCompletion(systemPrompt, userPrompt, {
      temperature: 0.8,
      max_tokens: 3000,
    });

    // Ensure response is an array
    const questions = Array.isArray(response) ? response : response.questions || [];

    if (questions.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No questions generated',
        message: 'The AI could not generate questions. Please try again.',
      });
    }

    // Save to database
    const questionHistory = new QuestionHistory({
      userId,
      syllabus,
      questionType,
      questions,
    });

    await questionHistory.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${userId}`).emit('notification:receive', {
        type: 'questions',
        title: 'Questions Generated',
        body: `Your ${questionType} questions have been generated and saved to your history.`,
        data: questions,
        source: 'questions',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send questions notification:', notifyError.message);
    }

    res.json({
      success: true,
      questions,
      historyId: questionHistory._id,
    });
  } catch (error) {
    console.error('❌ Generate questions error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/questions/history?userId=xxx
 * @desc    Get user's question generation history
 * @access  Protected
 */
export const getQuestionHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const history = await QuestionHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v');

    res.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('❌ Get question history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  generateQuestions,
  getQuestionHistory,
};
