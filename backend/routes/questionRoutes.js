import { generateJSONCompletion } from '../services/groqService.js';
import QuestionHistory from '../models/QuestionHistory.js';
import express from 'express';

const router = express.Router();

/**
 * Utility: Parse syllabus into topics
 * @param {string} syllabus
 * @returns {string[]}
 */
function extractTopics(syllabus) {
  // Simple topic extraction by splitting on newlines and colons
  return syllabus
    .split(/\n|:/)
    .map(t => t.trim())
    .filter(t => t.length > 3 && !/^\d+$/.test(t));
}

/**
 * Utility: Validate generated questions
 * @param {Array} questions
 * @param {string[]} topics
 * @param {number} marks
 * @param {string} type
 * @returns {Object}
 */
function validateQuestions(questions, topics, marks, type) {
  const errors = [];
  if (!Array.isArray(questions)) {
    errors.push('Questions must be an array');
    return { valid: false, errors };
  }
  // Mark type validation
  for (const q of questions) {
    if (q.marks !== marks) errors.push(`Invalid marks for question: ${q.question}`);
    if (!topics.includes(q.topic)) errors.push(`Topic not in syllabus: ${q.topic}`);
    if (!q.question || typeof q.question !== 'string') errors.push('Missing question text');
  }
  // Count validation
  if (['2m', '3m'].includes(type) && (questions.length < 10 || questions.length > 15)) {
    errors.push('Short answer count must be 10-15');
  }
  if (['14m', '16m'].includes(type) && (questions.length < 5 || questions.length > 8)) {
    errors.push('Long answer count must be 5-8');
  }
  // Topic variety
  const uniqueTopics = new Set(questions.map(q => q.topic));
  if (uniqueTopics.size < Math.min(questions.length, topics.length)) {
    errors.push('Insufficient topic variety');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * @route   POST /api/questions/generate
 * @desc    Generate questions by mark type, validate, and persist
 * @access  Protected
 */
router.post('/questions/generate', async (req, res) => {
  try {
    const { syllabus, questionType, userId } = req.body;
    if (!syllabus || !questionType || !userId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!['2m', '3m', '14m', '16m'].includes(questionType)) {
      return res.status(400).json({ success: false, error: 'Invalid question type' });
    }
    const marksMap = { '2m': 2, '3m': 3, '14m': 14, '16m': 16 };
    const marks = marksMap[questionType];
    const topics = extractTopics(syllabus);
    // Build prompt for Groq
    const systemPrompt = `You are an expert question paper setter for university exams. Generate questions strictly based on the provided syllabus.\n\nRules:\n1. Generate ONLY questions for the specified mark type\n2. Questions must be relevant to the syllabus topics\n3. Return valid JSON array format: [{"question": "...", "marks": X, "topic": "..."}]\n4. For 2m and 3m: generate 10-15 short answer questions\n5. For 14m and 16m: generate 5-8 long answer/problem-solving questions\n6. Ensure variety in topics covered`;
    const userPrompt = `Generate ${questionType} questions from this syllabus:\n\n${syllabus}\n\nReturn ONLY a JSON array of questions in this format:\n[{"question": "Question text here", "marks": ${marks}, "topic": "Relevant topic from syllabus"}]`;
    // Call Groq API
    const response = await generateJSONCompletion(systemPrompt, userPrompt, {
      temperature: 0.8,
      max_tokens: 3000,
    });
    const questions = Array.isArray(response) ? response : response.questions || [];
    // Validate
    const validation = validateQuestions(questions, topics, marks, questionType);
    if (!validation.valid) {
      return res.status(422).json({ success: false, error: 'Validation failed', details: validation.errors });
    }
    // Save to DB
    const questionHistory = new QuestionHistory({ userId, syllabus, questionType, questions });
    await questionHistory.save();
    res.json({ success: true, questions, historyId: questionHistory._id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate questions', message: error.message });
  }
});

/**
 * @route   GET /api/questions/history
 * @desc    Get user's question generation history
 * @access  Protected
 */
router.get('/questions/history', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId parameter' });
    }
    const history = await QuestionHistory.find({ userId }).sort({ createdAt: -1 }).limit(50).select('-__v');
    res.json({ success: true, history, count: history.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history', message: error.message });
  }
});

/**
 * @route   POST /api/questions/validate
 * @desc    Validate a batch of questions for mark type and topic variety
 * @access  Protected
 */
router.post('/questions/validate', async (req, res) => {
  try {
    const { questions, syllabus, questionType } = req.body;
    if (!questions || !syllabus || !questionType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const marksMap = { '2m': 2, '3m': 3, '14m': 14, '16m': 16 };
    const marks = marksMap[questionType];
    const topics = extractTopics(syllabus);
    const validation = validateQuestions(questions, topics, marks, questionType);
    if (!validation.valid) {
      return res.status(422).json({ success: false, error: 'Validation failed', details: validation.errors });
    }
    res.json({ success: true, message: 'Questions are valid' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Validation error', message: error.message });
  }
});

/**
 * @route   GET /api/questions/topics
 * @desc    Extract topics from syllabus
 * @access  Protected
 */
router.get('/questions/topics', (req, res) => {
  const { syllabus } = req.query;
  if (!syllabus) {
    return res.status(400).json({ success: false, error: 'Missing syllabus' });
  }
  const topics = extractTopics(syllabus);
  res.json({ success: true, topics });
});

/**
 * @route   POST /api/questions/generate-multi
 * @desc    Generate multiple sets of questions for different mark types
 * @access  Protected
 */
router.post('/questions/generate-multi', async (req, res) => {
  try {
    const { syllabus, userId, types } = req.body;
    if (!syllabus || !userId || !Array.isArray(types) || types.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const marksMap = { '2m': 2, '3m': 3, '14m': 14, '16m': 16 };
    const topics = extractTopics(syllabus);
    const results = [];
    for (const type of types) {
      if (!marksMap[type]) continue;
      const marks = marksMap[type];
      const systemPrompt = `You are an expert question paper setter for university exams. Generate questions strictly based on the provided syllabus.\n\nRules:\n1. Generate ONLY questions for the specified mark type\n2. Questions must be relevant to the syllabus topics\n3. Return valid JSON array format: [{"question": "...", "marks": X, "topic": "..."}]\n4. For 2m and 3m: generate 10-15 short answer questions\n5. For 14m and 16m: generate 5-8 long answer/problem-solving questions\n6. Ensure variety in topics covered`;
      const userPrompt = `Generate ${type} questions from this syllabus:\n\n${syllabus}\n\nReturn ONLY a JSON array of questions in this format:\n[{"question": "Question text here", "marks": ${marks}, "topic": "Relevant topic from syllabus"}]`;
      const response = await generateJSONCompletion(systemPrompt, userPrompt, {
        temperature: 0.8,
        max_tokens: 3000,
      });
      const questions = Array.isArray(response) ? response : response.questions || [];
      const validation = validateQuestions(questions, topics, marks, type);
      results.push({ type, questions, valid: validation.valid, errors: validation.errors });
      // Optionally save each set
      if (validation.valid) {
        const questionHistory = new QuestionHistory({ userId, syllabus, questionType: type, questions });
        await questionHistory.save();
      }
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate multiple sets', message: error.message });
  }
});

/**
 * @route   GET /api/questions/by-topic
 * @desc    Get questions by topic for a user
 * @access  Protected
 */
router.get('/questions/by-topic', async (req, res) => {
  try {
    const { userId, topic } = req.query;
    if (!userId || !topic) {
      return res.status(400).json({ success: false, error: 'Missing userId or topic' });
    }
    const questions = await QuestionHistory.find({ userId, 'questions.topic': topic }).select('questions');
    // Flatten questions
    const flat = questions.reduce((acc, qh) => acc.concat(qh.questions.filter(q => q.topic === topic)), []);
    res.json({ success: true, questions: flat, count: flat.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch questions by topic', message: error.message });
  }
});

/**
 * @route   POST /api/questions/manual-add
 * @desc    Manually add a question to history
 * @access  Protected
 */
router.post('/questions/manual-add', async (req, res) => {
  try {
    const { userId, syllabus, questionType, question } = req.body;
    if (!userId || !syllabus || !questionType || !question) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const questionHistory = new QuestionHistory({ userId, syllabus, questionType, questions: [question] });
    await questionHistory.save();
    res.json({ success: true, historyId: questionHistory._id });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add question', message: error.message });
  }
});

/**
 * @route   DELETE /api/questions/history/:id
 * @desc    Delete a question history record
 * @access  Protected
 */
router.delete('/questions/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await QuestionHistory.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'History not found' });
    }
    res.json({ success: true, message: 'History deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete history', message: error.message });
  }
});

export default router;
