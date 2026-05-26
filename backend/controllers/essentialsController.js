import { extractTextFromFile, cleanupFile } from '../services/extractors.js';
import { extractStructuredData } from '../services/pplxService.js';
import Essentials from '../models/Essentials.js';

/**
 * @route   POST /api/essentials/extract
 * @desc    Extract semester essentials from uploaded file
 * @access  Protected
 * 
 * Request: multipart/form-data
 * - file: (image/pdf/video)
 * - Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   success: true,
 *   essentials: {
 *     creativeQuestions: [...],
 *     theoryTopics: [...],
 *     numericalTopics: [...],
 *     marksDistribution: {...}
 *   }
 * }
 */
export const extractEssentials = async (req, res) => {
  let filePath = null;

  try {
    // Check if user is authenticated
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User authentication required',
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload a file (PDF, image, or video)',
      });
    }

    const userId = req.user.uid;
    filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;

    console.log(`📄 Processing file: ${fileName} for user: ${userId}`);

    // Step 1: Extract text from file
    const extractedText = await extractTextFromFile(filePath, fileType);

    if (!extractedText || extractedText.trim().length < 50) {
      cleanupFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'Insufficient content',
        message: 'Could not extract meaningful text from the file. Please upload a clearer document.',
      });
    }

    console.log(`✅ Extracted ${extractedText.length} characters`);

    // Step 2: Extract structured essentials using Gemini AI
    const extractionPrompt = `Analyze the following syllabus content and extract semester essentials in strict JSON format.

Syllabus Content:
${extractedText}

Extract and categorize:
1. Creative/Open-ended questions that could be asked
2. Theory topics (concepts, definitions, explanations)
3. Numerical/Problem-solving topics
4. Marks distribution by question types

Return ONLY valid JSON in this exact format:
{
  "creativeQuestions": [
    {"question": "...", "unit": "..."}
  ],
  "theoryTopics": [
    {"topic": "...", "unit": "...", "importance": "high/medium/low"}
  ],
  "numericalTopics": [
    {"topic": "...", "unit": "...", "difficulty": "easy/medium/hard"}
  ],
  "marksDistribution": {
    "twoMarks": ["Topic 1", "Topic 2"],
    "threeMarks": ["Topic 1"],
    "fourteenMarks": ["Topic 1"],
    "sixteenMarks": ["Topic 1"]
  }
}`;

    const essentials = await extractStructuredData(extractedText, extractionPrompt);

    // Step 3: Save to MongoDB
    const essentialsDoc = new Essentials({
      userId,
      fileName,
      fileType,
      extractedText: extractedText.substring(0, 5000), // Save first 5000 chars
      essentials,
    });

    await essentialsDoc.save();

    // Trigger notification via Socket.IO (if available)
    try {
      const { getIO } = await import('../config/socket.js');
      const io = getIO();
      io.to(`user:${userId}`).emit('notification:receive', {
        type: 'essentials',
        title: 'Essentials Extracted',
        body: 'Your semester essentials have been extracted and saved.',
        data: essentials,
        source: 'essentials',
        createdAt: new Date()
      });
    } catch (notifyError) {
      console.warn('⚠️  Could not send essentials notification:', notifyError.message);
    }

    // Cleanup temporary file
    cleanupFile(filePath);

    console.log(`✅ Essentials saved for user: ${userId}`);

    res.json({
      success: true,
      essentials,
      essentialsId: essentialsDoc._id,
      fileName,
    });
  } catch (error) {
    console.error('❌ Extract essentials error:', error.message);

    // Cleanup file on error
    if (filePath) {
      cleanupFile(filePath);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to extract essentials',
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/essentials/history?userId=xxx
 * @desc    Get user's essentials history
 * @access  Protected
 */
export const getEssentialsHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    const history = await Essentials.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-extractedText -__v'); // Exclude large text field

    res.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('❌ Get essentials history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      message: error.message,
    });
  }
};

export default {
  extractEssentials,
  getEssentialsHistory,
};
