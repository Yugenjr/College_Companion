/**
 * Comprehensive Controllers for all AI Features
 * All functions save data to user-specific MongoDB documents
 */

import User from '../models/User.js';
import { generateQuestions as genQuestions, generateSurvivalPlan as genSurvivalPlan, attendanceAdvisor as attendanceAI } from '../services/groqService.js';
import { extractEssentialsFromFile, generateRevisionPlan as genRevisionPlan, doubtSolver as solveDoubt } from '../services/pplxService.js';
import { extractTextFromFile } from '../services/fileExtractor.js';

/**
 * POST /api/questions/generate
 * Generate questions using Groq AI
 */
export const generateQuestions = async (req, res) => {
  try {
    const { uid } = req.user;
    const { syllabus, questionType } = req.body;

    if (!syllabus || !questionType) {
      return res.status(400).json({ success: false, error: 'Missing syllabus or questionType', code: 400 });
    }

    const result = await genQuestions(syllabus, questionType);

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.questionHistory.push({
      syllabus,
      questionType,
      result,
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, questions: result.questions, savedTo: 'questionHistory' });
  } catch (error) {
    console.error('❌ Question generation error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * POST /api/survival/generate
 * Generate semester survival plan using Groq AI
 */
export const generateSurvivalPlan = async (req, res) => {
  try {
    const { uid } = req.user;
    const { skills, stressLevel, timeAvailable, examDates, goals } = req.body;

    if (!skills || !stressLevel || !timeAvailable) {
      return res.status(400).json({ success: false, error: 'Missing required fields', code: 400 });
    }

    const plan = await genSurvivalPlan({ skills, stressLevel, timeAvailable, examDates, goals });

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.survivalPlans.push({
      ...plan,
      parameters: { skills, stressLevel, timeAvailable, examDates, goals },
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, plan, savedTo: 'survivalPlans' });
  } catch (error) {
    console.error('❌ Survival plan error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * POST /api/attendance/query
 * Attendance advisor using Groq AI
 */
export const attendanceQuery = async (req, res) => {
  try {
    const { uid } = req.user;
    const { question, attendanceData } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Missing question', code: 400 });
    }

    const advice = await attendanceAI(question, attendanceData || {});

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.attendanceQueries.push({
      question,
      attendanceData,
      advice,
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, advice, savedTo: 'attendanceQueries' });
  } catch (error) {
    console.error('❌ Attendance query error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * POST /api/essentials/extract
 * Extract essentials from uploaded file using Gemini AI
 */
export const extractEssentials = async (req, res) => {
  try {
    const { uid } = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded', code: 400 });
    }

    // Extract text from file
    const fileText = await extractTextFromFile(file);

    // Use Gemini AI to structure the content
    const essentials = await extractEssentialsFromFile(fileText, file.originalname);

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.essentials.push({
      fileName: file.originalname,
      fileType: file.mimetype,
      ...essentials,
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, essentials, savedTo: 'essentials' });
  } catch (error) {
    console.error('❌ Essentials extraction error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * POST /api/revision/generate
 * Generate revision plan using Gemini AI
 */
export const generateRevisionPlan = async (req, res) => {
  try {
    const { uid } = req.user;
    const { syllabusText, preferences } = req.body;

    if (!syllabusText) {
      return res.status(400).json({ success: false, error: 'Missing syllabusText', code: 400 });
    }

    const plan = await genRevisionPlan(syllabusText, preferences || {});

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.revisionPlans.push({
      syllabusText,
      preferences,
      ...plan,
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, plan, savedTo: 'revisionPlans' });
  } catch (error) {
    console.error('❌ Revision plan error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * POST /api/doubt/ask
 * Solve doubts using Gemini AI (fallback to Groq)
 */
export const askDoubt = async (req, res) => {
  try {
    const { uid } = req.user;
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Missing question', code: 400 });
    }

    const answer = await solveDoubt(question, context || '');

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    user.savedChats.push({
      question,
      context,
      answer,
      timestamp: new Date()
    });

    await user.save();

    res.json({ success: true, answer, savedTo: 'savedChats' });
  } catch (error) {
    console.error('❌ Doubt solver error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
      try {
};

/**
 * POST /api/notes
 * Create a note
 */
export const createNote = async (req, res) => {
  try {
    const { uid } = req.user;
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Missing title or content', code: 400 });
    }

    let user = await User.findById(uid);
    if (!user) {
      user = new User({ uid, profile: { email: req.user.email } });
    }

    const note = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags || [],
      createdAt: new Date()
    };

    user.notes.push(note);
    await user.save();

    res.json({ success: true, note });
  } catch (error) {
    console.error('❌ Create note error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * GET /api/notes
 * Get all notes for user
 */
export const getNotes = async (req, res) => {
  try {
    const uid = req.query.uid || req.user.uid;

    const user = await User.findById(uid);
    if (!user) {
      return res.json({ success: true, notes: [] });
    }

    res.json({ success: true, notes: user.notes || [] });
  } catch (error) {
    console.error('❌ Get notes error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * PUT /api/notes/:id
 * Update a note
 */
export const updateNote = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }

    const noteIndex = user.notes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      return res.status(404).json({ success: false, error: 'Note not found', code: 404 });
    }

    user.notes[noteIndex] = {
      ...user.notes[noteIndex],
      title: title || user.notes[noteIndex].title,
      content: content || user.notes[noteIndex].content,
      tags: tags || user.notes[noteIndex].tags,
      updatedAt: new Date()
    };

    await user.save();

    res.json({ success: true, note: user.notes[noteIndex] });
  } catch (error) {
    console.error('❌ Update note error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
export const deleteNote = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }

    user.notes = user.notes.filter(n => n.id !== id);
    await user.save();

    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('❌ Delete note error:', error.message);
    res.status(500).json({ success: false, error: error.message, code: 500 });
  }
};

export default {
  generateQuestions,
  generateSurvivalPlan,
  attendanceQuery,
  extractEssentials,
  generateRevisionPlan,
  askDoubt,
  createNote,
  getNotes,
  updateNote,
  deleteNote
};
