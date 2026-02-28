import { generateJSONCompletion } from '../services/groqService.js';
import { getUserAttendanceContext } from '../services/storage.js';
import AttendanceQuery from '../models/AttendanceQuery.js';

/**
 * @route   POST /api/attendance/query
 * @desc    Query attendance advisor with user's attendance context
 * @access  Protected
 * 
 * Request body:
 * {
 *   userId: string,
 *   question: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   advice: {
 *     canTakeLeave: boolean,
 *     impactPercent: number,
 *     recommendedDates: string[],
 *     reasoning: string
 *   }
 * }
 */
export const queryAttendanceAdvisor = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId and question are required',
      });
    }

    // Fetch user's attendance context from Firestore
    const context = await getUserAttendanceContext(userId);

    // Check if user has uploaded necessary data
    if (!context.calendarData && !context.timetableData && !context.attendanceStats) {
      return res.status(400).json({
        success: false,
        error: 'INSUFFICIENT_DATA',
        message: 'Please upload your academic calendar, timetable, and attendance data first.',
        requiredData: {
          calendar: !context.calendarData,
          timetable: !context.timetableData,
          attendanceStats: !context.attendanceStats,
        },
      });
    }

    // Build deterministic context object
    const contextData = {
      calendar: context.calendarData || null,
      timetable: context.timetableData || null,
      attendanceStats: context.attendanceStats || {
        currentPercentage: 0,
        classesAttended: 0,
        classesMissed: 0,
        totalClasses: 0,
      },
      leaveHistory: context.leaveHistory || [],
      absenceTimeline: context.absenceTimeline || [],
    };

    // Strict system prompt for deterministic responses
    const systemPrompt = `You are an Attendance Advisor AI. Your role is to provide data-driven attendance advice based ONLY on the provided JSON context.

CRITICAL RULES:
1. Use ONLY the data in the JSON context - do NOT invent or assume any information
2. Calculate impacts based on the provided attendance statistics
3. When data is insufficient or ambiguous, respond with the exact phrase "INSUFFICIENT_DATA"
4. Return responses in STRICT JSON format with these fields:
   - canTakeLeave: boolean (true/false based on calculations)
   - impactPercent: number (calculated percentage impact)
   - recommendedDates: array of strings (dates when leave is safest)
   - reasoning: string (explain your calculation and logic)

CALCULATION LOGIC:
- Current percentage = (classesAttended / totalClasses) * 100
- After missing N classes = ((classesAttended) / (totalClasses + N)) * 100
- Recommend leave only if resulting percentage stays above 75%
- Consider timetable to suggest days with fewer classes

Return ONLY valid JSON. No markdown, no explanations outside JSON.`;

    const userPrompt = `Context Data:
${JSON.stringify(contextData, null, 2)}

User Question: ${question}

Provide attendance advice in JSON format.`;

    // Call Groq API with JSON mode
    let advice;
    try {
      advice = await generateJSONCompletion(systemPrompt, userPrompt, {
        temperature: 0.3, // Lower temperature for more deterministic output
        max_tokens: 1500,
      });
    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      return res.status(500).json({
        success: false,
        error: 'AI processing failed',
        message: 'Could not generate advice. Please try again.',
      });
    }

    // Check for INSUFFICIENT_DATA response
    if (advice.reasoning && advice.reasoning.includes('INSUFFICIENT_DATA')) {
      return res.status(400).json({
        success: false,
        error: 'INSUFFICIENT_DATA',
        message: 'The AI could not provide advice with the available data.',
        advice: advice,
      });
    }

    // Validate response structure
    if (typeof advice.canTakeLeave !== 'boolean' || typeof advice.impactPercent !== 'number') {
      console.warn('⚠️  Invalid advice structure, using defaults');
      advice = {
        canTakeLeave: false,
        impactPercent: 0,
        recommendedDates: [],
        reasoning: 'Unable to calculate accurate advice with provided data.',
      };
    }

    // Save query to MongoDB for history
    const attendanceQuery = new AttendanceQuery({
      userId,
      question,
      context: contextData,
      response: {
        canTakeLeave: advice.canTakeLeave,
        impactPercent: advice.impactPercent,
        recommendedDates: advice.recommendedDates || [],
        reasoning: advice.reasoning,
        rawResponse: JSON.stringify(advice),
      },
    });

    await attendanceQuery.save();

    console.log(`✅ Attendance query processed for user: ${userId}`);

    res.json({
      success: true,
      advice,
      queryId: attendanceQuery._id,
    });
  } catch (error) {
    console.error('❌ Query attendance advisor error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process query',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/attendance/history?userId=xxx
 * @desc    Get user's attendance query history
 * @access  Protected
 */
export const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.query;

      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const history = await AttendanceQuery.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-context -__v'); // Exclude large context object

    res.json({
    try {
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('❌ Get attendance history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  queryAttendanceAdvisor,
  getAttendanceHistory,
};
