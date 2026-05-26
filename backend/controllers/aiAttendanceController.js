import { generateGroqResponse } from '../services/groqService.js';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from image using OCR
 */
const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: info => console.log(info)
      }
    );
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Extract text from text file
 */
const extractTextFromTextFile = (fileBuffer) => {
  try {
    return fileBuffer.toString('utf-8');
  } catch (error) {
    console.error('Text file read error:', error.message);
    throw new Error('Failed to read text file');
  }
};

/**
 * Extract text based on file type
 */
const extractText = async (file) => {
  if (!file) return '';

  const mimeType = file.mimetype;
  const fileName = file.originalname.toLowerCase();

  try {
    // PDF files
    if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('📄 Extracting text from PDF...');
      return await extractTextFromPDF(file.buffer);
    }

    // Image files
    if (mimeType.startsWith('image/')) {
      console.log('🖼️ Extracting text from image using OCR...');
      
      const tempPath = path.join(__dirname, '../uploads', file.originalname);
      await fs.writeFile(tempPath, file.buffer);
      
      const text = await extractTextFromImage(tempPath);
      
      await fs.unlink(tempPath).catch(err => console.error('Temp file cleanup error:', err));
      
      return text;
    }

    // Text files
    if (mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      console.log('📝 Reading text file...');
      return extractTextFromTextFile(file.buffer);
    }

    // Excel/CSV files
    if (fileName.endsWith('.csv') || fileName.endsWith('.xlsx')) {
      console.log('📊 Reading data file...');
      return extractTextFromTextFile(file.buffer);
    }

    throw new Error(`Unsupported file type: ${mimeType}`);

  } catch (error) {
    console.error('Text extraction error:', error.message);
    throw error;
  }
};

/**
 * Handle AI chat with optional file upload
 * POST /api/ai-attendance/chat
 */
export const handleAIChat = async (req, res) => {
  try {
    let message = req.body.message || req.body.query;
    let context = req.body.context;
    const file = req.file;

    // Parse context if it's a string
    if (typeof context === 'string') {
      try {
        context = JSON.parse(context);
      } catch (e) {
        console.warn('Could not parse context:', e.message);
        context = {};
      }
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message or query is required and must be a non-empty string'
      });
    }

    console.log('💬 Processing AI chat request...');
    console.log('📩 Message:', message);
    console.log('📎 File attached:', file ? file.originalname : 'None');

    // Extract text from uploaded file
    let extractedText = '';
    if (file) {
      try {
        extractedText = await extractText(file);
        console.log(`✅ Extracted ${extractedText.length} characters from file`);
      } catch (extractError) {
        console.error('File extraction failed:', extractError.message);
        return res.status(400).json({
          success: false,
          error: `File processing failed: ${extractError.message}`
        });
      }
    }

    // Build prompt
    let prompt = '';
    
    if (extractedText) {
      prompt = `You are an AI Attendance Advisor. The user has uploaded a file with the following content:

UPLOADED FILE CONTENT:
${extractedText}

CONTEXT (if provided):
${context ? JSON.stringify(context, null, 2) : 'None'}

USER QUESTION:
${message}

Please analyze the uploaded content and provide a helpful, accurate response to the user's question. If the question relates to attendance data, provide specific insights, calculations, and recommendations.`;
    } else {
      prompt = `You are an AI Attendance Advisor.

${context ? `CONTEXT:\n${JSON.stringify(context, null, 2)}\n\n` : ''}USER QUESTION:
${message}

Please provide a helpful and accurate response.`;
    }

    // Generate AI response using the existing groqService
    const aiResponse = await generateGroqResponse(prompt, 'attendance-advisor');

    // Return successful response
    res.json({

      success: true,
      response: aiResponse,
      metadata: {
        hasFile: !!file,
        fileName: file?.originalname,
        fileType: file?.mimetype,
        extractedTextLength: extractedText.length,
        timestamp: new Date().toISOString()
      }
    });

    // Trigger notification via Socket.IO (if available)
    try {
      const userId = req.user?.uid;
      if (userId) {
        const { getIO } = await import('../config/socket.js');
        const io = getIO();
        io.to(`user:${userId}`).emit('notification:receive', {
          type: 'ai-attendance',
          title: 'AI Attendance Response',
          body: 'Your AI attendance query has been processed.',
          data: aiResponse,
          source: 'ai-attendance',
          createdAt: new Date()
        });
      }
    } catch (notifyError) {
      console.warn('⚠️  Could not send AI attendance notification:', notifyError.message);
    }

  } catch (error) {
    console.error('❌ AI chat controller error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process AI chat request',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Health check endpoint
 * GET /api/ai-attendance/health
 */
export const healthCheck = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'AI Attendance API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        chat: 'POST /api/ai-attendance/chat'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default { handleAIChat, healthCheck };
