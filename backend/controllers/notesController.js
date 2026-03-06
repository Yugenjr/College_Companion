import Note from '../models/Note.js';

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Protected
 */
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, tags, type } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId, title, and content are required',
      });
    }

    const note = new Note({
      userId,
      title,
      content,
      tags: tags || [],
      type: type || 'other',
    });

    await note.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${userId}`).emit('notification:receive', {
        type: 'note',
        title: 'New Note Created',
        body: `Your note "${title}" has been created successfully.`,
        data: note,
        source: 'notes',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send note notification:', notifyError.message);
    }

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('❌ Create note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create note',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/notes?userId=xxx
 * @desc    Get user's notes
 * @access  Protected
 */
export const getNotes = async (req, res) => {
  try {
    const { userId, type } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      notes,
      count: notes.length,
    });
  } catch (error) {
    console.error('❌ Get notes error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 * @access  Protected
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, type } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (type) updateData.type = type;
    updateData.updatedAt = new Date();

    const note = await Note.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('❌ Update note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Protected
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete note error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
      message: error.message,
    });
  }
};

export default {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
