import Groq from 'groq-sdk';
import CircuitBreaker from 'opossum';
import { GoogleGenerativeAI } from '@google/generative-ai';

let groqClient = null;
let geminiModel = null;
let groqCircuitBreaker = null;

const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 500,
  backoffMultiplier: 2,
};

const CIRCUIT_BREAKER_CONFIG = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
};

const logEvent = (level, event, details = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: 'ai-provider',
    provider: 'groq-with-gemini-fallback',
    ...details,
  };

  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const normalizeError = (error) => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Unknown AI provider error');
};

const sanitizeResponseText = (text) => {
  if (!text) {
    return '';
  }

  if (typeof text !== 'string') {
    return String(text);
  }

  return text;
};

/**
 * Architecture decision:
 * Groq remains the primary provider for low latency, while Gemini is configured
 * as a resilience fallback. We isolate provider calls behind one function
 * (`generateAIResponse`) so controllers can remain unaware of outages and transport logic.
 */
const buildGroqRequest = (prompt, options = {}) => ({
  model: options.model || 'llama-3.3-70b-versatile',
  messages: options.messages || [{ role: 'user', content: prompt }],
  temperature: options.temperature ?? 0.7,
  max_tokens: options.max_tokens ?? 4096,
  response_format: options.json ? { type: 'json_object' } : undefined,
});

const formatMessagesForFallback = (messages = [], fallbackPrompt = '') => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return fallbackPrompt;
  }

  return messages
    .map((message) => {
      const role = message?.role || 'user';
      const content = message?.content || '';
      return `[${role.toUpperCase()}]\n${content}`;
    })
    .join('\n\n');
};

const isCircuitOpenError = (error) => {
  const normalized = normalizeError(error);
  const message = normalized.message || '';
  return normalized.code === 'EOPENBREAKER' || message.includes('Breaker is open');
};

const initializeCircuitBreaker = () => {
  if (!groqClient) {
    return null;
  }

  const groqAction = async (requestConfig) => {
    const response = await groqClient.chat.completions.create(requestConfig);
    return response.choices[0]?.message?.content || '';
  };

  groqCircuitBreaker = new CircuitBreaker(groqAction, CIRCUIT_BREAKER_CONFIG);

  groqCircuitBreaker.on('open', () => {
    logEvent('warn', 'circuit_open', {
      timeout: CIRCUIT_BREAKER_CONFIG.timeout,
      errorThresholdPercentage: CIRCUIT_BREAKER_CONFIG.errorThresholdPercentage,
      resetTimeout: CIRCUIT_BREAKER_CONFIG.resetTimeout,
    });
  });

  groqCircuitBreaker.on('halfOpen', () => {
    logEvent('info', 'circuit_half_open');
  });

  groqCircuitBreaker.on('close', () => {
    logEvent('info', 'circuit_closed');
  });

  groqCircuitBreaker.on('failure', (error) => {
    const normalized = normalizeError(error);
    logEvent('warn', 'groq_circuit_failure', { error: normalized.message });
  });

  return groqCircuitBreaker;
};

const initializeGeminiFallback = () => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    logEvent('warn', 'gemini_not_configured');
    geminiModel = null;
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return geminiModel;
  } catch (error) {
    const normalized = normalizeError(error);
    logEvent('error', 'gemini_init_failed', { error: normalized.message });
    geminiModel = null;
    return null;
  }
};

const callGroqWithRetry = async (requestConfig) => {
  if (!groqCircuitBreaker) {
    throw new Error('Groq circuit breaker not initialized. Call initializeGroqClient() first.');
  }

  let lastError = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt += 1) {
    try {
      return await groqCircuitBreaker.fire(requestConfig);
    } catch (error) {
      lastError = normalizeError(error);

      if (isCircuitOpenError(lastError)) {
        throw lastError;
      }

      if (attempt < RETRY_CONFIG.maxRetries) {
        const delayMs = RETRY_CONFIG.initialDelayMs * (RETRY_CONFIG.backoffMultiplier ** attempt);
        logEvent('warn', 'retry_scheduled', {
          provider: 'groq',
          attempt: attempt + 1,
          maxRetries: RETRY_CONFIG.maxRetries,
          delayMs,
          error: lastError.message,
        });
        await sleep(delayMs);
      }
    }
  }

  throw lastError || new Error('Groq request failed after retries');
};

const callGeminiFallback = async (prompt, options = {}) => {
  if (!geminiModel) {
    throw new Error('Gemini fallback is not configured');
  }

  const fallbackPrompt = formatMessagesForFallback(options.messages, prompt);
  const result = await geminiModel.generateContent(fallbackPrompt);
  const text = result?.response?.text?.() || '';

  if (options.json && !text.trim()) {
    throw new Error('Gemini returned an empty JSON response');
  }

  return sanitizeResponseText(text);
};

const extractJSONString = (textResponse) => {
  let jsonText = textResponse.trim();

  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  return jsonText;
};

/**
 * Initialize Groq SDK client with fallback support
 */
export const initializeGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }

  groqClient = new Groq({ apiKey });
  initializeCircuitBreaker();
  initializeGeminiFallback();

  logEvent('info', 'provider_initialized', {
    groq: true,
    geminiFallback: Boolean(geminiModel),
    circuitBreaker: CIRCUIT_BREAKER_CONFIG,
  });
  return groqClient;
};

/**
 * Get Groq client instance
 */
export const getGroqClient = () => {
  if (!groqClient) {
    throw new Error('Groq client not initialized. Call initializeGroqClient() first.');
  }
  return groqClient;
};

/**
 * Unified AI entrypoint.
 *
 * Architecture decision:
 * - Primary path: Groq behind circuit breaker + exponential retry
 * - Failover path: Gemini when Groq is unavailable, timing out, or circuit is open
 *
 * This keeps controller code stable while hardening reliability characteristics.
 */
export const generateAIResponse = async (prompt, options = {}) => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  const requestConfig = buildGroqRequest(prompt, options);

  try {
    const groqText = await callGroqWithRetry(requestConfig);
    return sanitizeResponseText(groqText);
  } catch (groqError) {
    const normalizedGroqError = normalizeError(groqError);
    logEvent('warn', 'fallback_activated', {
      from: 'groq',
      to: 'gemini',
      reason: normalizedGroqError.message,
    });

    try {
      return await callGeminiFallback(prompt, options);
    } catch (geminiError) {
      const normalizedGeminiError = normalizeError(geminiError);
      logEvent('error', 'providers_exhausted', {
        groqError: normalizedGroqError.message,
        geminiError: normalizedGeminiError.message,
      });
      throw new Error(`AI generation failed: Groq(${normalizedGroqError.message}) | Gemini(${normalizedGeminiError.message})`);
    }
  }
};

/**
 * Generate completion using Groq with automatic fallback
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {object} options - Additional options (model, temperature, max_tokens)
 * @returns {Promise<string>} - Generated text
 */
export const generateCompletion = async (systemPrompt, userPrompt, options = {}) => {
  const prompt = `${systemPrompt}\n\n${userPrompt}`;
  return await generateAIResponse(prompt, {
    ...options,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
};

/**
 * Generate JSON completion using Groq
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Parsed JSON response
 */
export const generateJSONCompletion = async (systemPrompt, userPrompt, options = {}) => {
  try {
    const textResponse = await generateCompletion(
      systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no explanations.',
      userPrompt,
      { ...options, json: true }
    );

    const jsonText = extractJSONString(textResponse);
    return JSON.parse(jsonText);
  } catch (error) {
    const normalized = normalizeError(error);
    logEvent('error', 'json_parse_failed', { error: normalized.message });
    throw new Error(`Failed to parse AI JSON response: ${normalized.message}`);
  }
};

/**
 * Generate AI response for general queries
 */
export const generateGroqResponse = async (userPrompt, contextType = 'general', options = {}) => {
  const systemPrompts = {
    'attendance-advisor': 'You are an intelligent AI assistant specializing in attendance management, academic planning, and student advisory. Provide clear, actionable, and accurate responses.',
    'question-generator': 'You are an expert question generator for educational purposes. Generate relevant, challenging questions.',
    'survival-plan': 'You are an academic survival plan assistant. Help students plan their semester effectively.',
    'essentials': 'You are an essentials extractor. Extract key points and important information from content.',
    'revision': 'You are a revision strategy expert. Help students create effective revision plans.',
    'doubt-solver': 'You are a doubt solver. Provide clear explanations to student questions.',
    'general': 'You are a helpful AI assistant. Provide accurate and useful responses.'
  };

  const systemPrompt = systemPrompts[contextType] || systemPrompts.general;
  return await generateCompletion(systemPrompt, userPrompt, options);
};

/**
 * Generate questions from syllabus
 */
export const generateQuestions = async (syllabus, questionType) => {
  const systemPrompt = 'You are an expert question generator. Create educational questions based on syllabus content. Return ONLY valid JSON.';
  const userPrompt = `Generate ${questionType} questions for this syllabus. Return JSON in this format:

{
  "questions": [
    {
      "question": "Question text",
      "type": "${questionType}",
      "difficulty": "easy|medium|hard",
      "topic": "Topic name"
    }
  ]
}

Syllabus: ${syllabus}`;

  const response = await generateCompletion(systemPrompt, userPrompt, { json: true });

  const jsonText = extractJSONString(response);
  return JSON.parse(jsonText);
};

/**
 * Generate survival plan
 */
export const generateSurvivalPlan = async (params) => {
  const { skills, stressLevel, timeAvailable, examDates, goals } = params;

  const systemPrompt = 'You are an academic planning expert. Create comprehensive semester survival plans. Return ONLY valid JSON.';
  const userPrompt = `Create a semester survival plan with these parameters:

Skills: ${skills}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates}
Goals: ${goals}

Return JSON in this format:

{
  "weeklyPlan": [
    {
      "week": 1,
      "focus": "Main focus area",
      "tasks": ["task1", "task2"],
      "goals": "Weekly goals"
    }
  ],
  "studySchedule": {
    "morning": "Activities",
    "afternoon": "Activities",
    "evening": "Activities"
  },
  "stressManagement": ["tip1", "tip2"],
  "examPreparation": {
    "strategy": "Exam strategy",
    "timeline": "Preparation timeline"
  }
}`;

  const response = await generateCompletion(systemPrompt, userPrompt, { json: true });

  const jsonText = extractJSONString(response);
  return JSON.parse(jsonText);
};

/**
 * Attendance advisor
 */
export const attendanceAdvisor = async (question, attendanceData = {}) => {
  const systemPrompt = 'You are an attendance management advisor. Provide structured attendance advice and calculations.';
  const userPrompt = `Analyze this attendance situation and provide advice.

${Object.keys(attendanceData).length > 0 ? `Current Attendance Data: ${JSON.stringify(attendanceData)}\n\n` : ''}Question: ${question}

Provide actionable advice including:
- Current attendance percentage (if data provided)
- Classes needed to reach target
- Risk assessment
- Recommendations`;

  return await generateCompletion(systemPrompt, userPrompt);
};

export default {
  initializeGroqClient,
  getGroqClient,
  generateAIResponse,
  generateCompletion,
  generateJSONCompletion,
  generateGroqResponse,
  generateQuestions,
  generateSurvivalPlan,
  attendanceAdvisor,
};
