import SurvivalPlan from '../models/SurvivalPlan.js';
import Note from '../models/Note.js';
import { generateSurvivalPlan } from '../services/groqSurvivalPlan.js';

// Generate survival plan using Gemini AI
export const generate = async (req, res) => {
  try {
    const { skills, stressLevel, timeAvailable, examDates, goals, userSkills, userId } = req.body;

    // Support both 'skills' and 'userSkills' for flexibility
    const skillsArray = skills || userSkills;

    // Validation
    if (!skillsArray || (typeof skillsArray === 'string' && !skillsArray.trim()) || (Array.isArray(skillsArray) && skillsArray.length === 0)) {
      return res.status(400).json({ error: 'skills is required' });
    }
    if (!stressLevel || !['low', 'medium', 'high'].includes(stressLevel)) {
      return res.status(400).json({ error: 'stressLevel must be low, medium, or high' });
    }
    if (!timeAvailable) {
      return res.status(400).json({ error: 'timeAvailable is required' });
    }
    if (!examDates || (typeof examDates === 'string' && !examDates.trim()) || (Array.isArray(examDates) && examDates.length === 0)) {
      return res.status(400).json({ error: 'examDates is required' });
    }
    if (!goals) {
      return res.status(400).json({ error: 'goals is required' });
    }

    // Convert to arrays if strings
    const skillsArrayParsed = typeof skillsArray === 'string' ? [skillsArray] : skillsArray;
    const examDatesArrayParsed = typeof examDates === 'string' ? [examDates] : examDates;

    console.log('📝 Generating survival plan...');
    console.log(`   Skills: ${skillsArrayParsed.join(', ')}`);
    console.log(`   Stress: ${stressLevel}`);
    console.log(`   Time: ${timeAvailable}`);
    console.log(`   Exams: ${examDatesArrayParsed.join(', ')}`);
    console.log(`   Goals: ${goals}`);

    // Generate plan using Gemini AI
    const generatedPlan = await generateSurvivalPlan({
      userSkills: skillsArrayParsed,
      stressLevel,
      timeAvailable,
      examDates: examDatesArrayParsed,
      goals,
      deadline: examDatesArrayParsed[0] || 'Not specified',
    });

    // Save to MongoDB
    const survivalPlan = new SurvivalPlan({
      userId: userId || 'anonymous',
      userSkills: skillsArrayParsed,
      stressLevel,
      timeAvailable,
      examDates: examDatesArrayParsed,
      goals,
      deadline: examDatesArrayParsed[0] || 'Not specified',
      generatedPlan,
    });

    await survivalPlan.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${userId || 'anonymous'}`).emit('notification:receive', {
        type: 'survival',
        title: 'Survival Plan Generated',
        body: 'Your personalized survival plan has been generated and saved.',
        data: generatedPlan,
        source: 'survival',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send survival plan notification:', notifyError.message);
    }

    console.log('✅ Survival plan generated and saved');

    res.status(200).json({
      success: true,
      plan: generatedPlan,
      savedId: survivalPlan._id,
    });
  } catch (error) {
    console.error('❌ Error generating survival plan:', error.message);
    res.status(500).json({
      error: 'AI request failed',
      message: error.message,
    });
  }
};

// Get survival plan history
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = userId ? { userId } : {};
    const plans = await SurvivalPlan.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error('❌ Error fetching history:', error.message);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

// Save survival plan as notes
export const saveNotes = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const note = new Note({
      userId,
      title,
      content,
      type: 'survival-plan',
    });

    await note.save();

    console.log('✅ Survival plan saved as note');

    res.status(200).json({
      success: true,
      message: 'Saved to notes successfully',
      noteId: note._id,
    });
  } catch (error) {
    console.error('❌ Error saving notes:', error.message);
    res.status(500).json({
      error: 'Failed to save notes',
      message: error.message,
    });
  }
};
