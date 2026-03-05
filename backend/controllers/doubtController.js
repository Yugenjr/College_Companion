import { generateCompletion } from '../services/groqService.js';
import Doubt from '../models/Doubt.js';
import Note from '../models/Note.js';

/**
 * @route   POST /api/doubt/ask
 * @desc    Ask a doubt and get AI-powered answer based on user's notes
 * @access  Protected
 */
export const askDoubt = async (req, res) => {
  try {
    const { userId, question, contextNotes } = req.body;

    if (!userId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId and question are required',
      });
    }

    // Fetch user's notes for context
    let userNotes = [];
    try {
      userNotes = await Note.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('title content tags');
    } catch (noteError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user notes',
        details: noteError.message,
      });
    }

    // Build context from notes
    let notesContext = '';
    const sources = [];

    if (userNotes.length > 0) {
      notesContext = 'Available notes for reference:\n\n';
      userNotes.forEach((note) => {
        notesContext += `Title: ${note.title}\n`;
        notesContext += `Content: ${note.content.substring(0, 500)}...\n\n`;
        sources.push({
          noteId: note._id,
          noteTitle: note.title,
          relevance: 'Referenced',
        });
      });
    } else {
      notesContext = 'No notes available. Providing general answer.';
    }

    // Add explicit context if provided
    if (contextNotes) {
      notesContext += `\nAdditional Context:\n${contextNotes}\n`;
    }

    const systemPrompt = `You are a helpful study assistant. Answer the student's question using ONLY the information from their notes and provided context. If the answer is not in the notes, clearly state that.

Rules:
1. Base your answer on the provided notes
2. Be clear and concise
3. If information is insufficient, suggest what additional study materials might help
4. Cite which notes you used in your answer`;

    const userPrompt = `${notesContext}

Question: ${question}

Provide a detailed answer based on the notes above.`;

    let answer;
    try {
      // Complex logic: AI-powered answer generation based on notes
      answer = await generateCompletion(systemPrompt, userPrompt, {
        temperature: 0.7,
        max_tokens: 1500,
      });
    } catch (aiError) {
      return res.status(500).json({
        success: false,
        error: 'AI answer generation failed',
        details: aiError.message,
      });
    }

    // Save doubt to database
    let doubt;
    try {
      doubt = new Doubt({
        userId,
        question,
        contextNotes,
        answer,
        sources,
      });
      await doubt.save();
    } catch (dbError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save doubt',
        details: dbError.message,
      });
    }

    res.json({
      success: true,
      answer,
      sources,
      doubtId: doubt._id,
    });
  } catch (error) {
    console.error('❌ Ask doubt error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process doubt',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/doubt/history?userId=xxx
 * @desc    Get user's doubt history
 * @access  Protected
 */
export const getDoubtHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const doubts = await Doubt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v');

    res.json({
      success: true,
      doubts,
      count: doubts.length,
    });
  } catch (error) {
    console.error('❌ Get doubt history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  askDoubt,
  getDoubtHistory,
};
