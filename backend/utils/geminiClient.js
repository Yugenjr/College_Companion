import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateAIResponse as generateUnifiedAIResponse } from '../services/groqService.js';

/**
 * Initialize Google Gemini AI Client
 */
let genAI = null;
let geminiText = null;
let geminiVision = null;

export const initializeGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not configured, will use Groq as primary');
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    geminiText = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    geminiVision = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Gemini AI client initialized');
    return { geminiText, geminiVision };
  } catch (error) {
    console.error('❌ Failed to initialize Gemini client:', error.message);
    return null;
  }
};

/**
 * Get Gemini text model instance
 */
export const getGeminiText = () => {
  if (!geminiText) {
    throw new Error('Gemini text model not initialized. Call initializeGeminiClient() first.');
  }
  return geminiText;
};

/**
 * Get Gemini vision model instance
 */
export const getGeminiVision = () => {
  if (!geminiVision) {
    throw new Error('Gemini vision model not initialized. Call initializeGeminiClient() first.');
  }
  return geminiVision;
};

/**
 * Generate text response through the unified resilient provider.
 *
 * Architecture decision:
 * We delegate text generation to `groqService.generateAIResponse` so retries,
 * circuit breaker behavior, and fallback orchestration are implemented once
 * in a single production path while preserving this module's public API.
 */
export const generateAIResponse = async (prompt, options = {}) => {
  return await generateUnifiedAIResponse(prompt, options);
};

/**
 * Generate response with message history (for chat-like interactions)
 */
export const generateAIResponseWithHistory = async (messages, options = {}) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  if (safeMessages.length === 0) {
    throw new Error('Message history must be a non-empty array');
  }

  const prompt = safeMessages.length > 0
    ? safeMessages
      .map((message) => `[${message?.role || 'user'}]\n${message?.content || ''}`)
      .join('\n\n')
    : '';

  return await generateUnifiedAIResponse(prompt, {
    ...options,
    messages: safeMessages,
  });
};

/**
 * Extract text from image using Gemini Vision (with Tesseract fallback)
 */
export const extractTextFromImageGemini = async (imageBuffer, mimeType = 'image/jpeg', prompt = 'Extract all meaningful text from this image.') => {
  try {
    console.log('✨ Calling Gemini Vision for OCR...');
    
    if (!geminiVision) {
      throw new Error('Gemini Vision not available');
    }

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const result = await geminiVision.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    console.log('✅ Gemini Vision OCR completed');
    return text;
  } catch (error) {
    console.error('❌ Gemini Vision failed:', error.message);
    throw error; // Let caller handle fallback to Tesseract
  }
};

/**
 * Check if Gemini is available
 */
export const isGeminiAvailable = () => {
  return geminiText !== null && geminiVision !== null;
};

export default {
  initializeGeminiClient,
  getGeminiText,
  getGeminiVision,
  generateAIResponse,
  generateAIResponseWithHistory,
  extractTextFromImageGemini,
  isGeminiAvailable,
};
