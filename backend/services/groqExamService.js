import Groq from 'groq-sdk';

let groqClient = null;
let fallbackGroqClient = null;

export const initializeGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  const fallbackKey = process.env.GROQ_FALLBACK_API_KEY;
  if (!apiKey && !fallbackKey) throw new Error('GROQ_API_KEY or GROQ_FALLBACK_API_KEY required');
  groqClient = new Groq({ apiKey: apiKey || fallbackKey });
  if (apiKey && fallbackKey && apiKey !== fallbackKey) fallbackGroqClient = new Groq({ apiKey: fallbackKey });
  return groqClient;
};

export const getGroqClient = () => {
  if (!groqClient) throw new Error('Groq client not initialized.');
  return groqClient;
};

/**
 * Generate exam-quality questions for multiple types
 * @param {string} syllabus
 * @param {string[]} types - ['fill-in-blank', 'case-study', 'numerical', 'conceptual', 'mixed']
 * @param {object} options
 * @returns {Promise<object>} - { type, questions: [...] }
 */
export const generateExamQuestions = async (syllabus, types, options = {}) => {
  const results = [];
  for (const type of types) {
    const systemPrompt = `You are an expert exam question generator. Create high-quality, challenging, pedagogically sound ${type} questions for university exams.\n\nRules:\n- Questions must be relevant to the syllabus topics\n- Format and content must match the type: ${type}\n- Return ONLY valid JSON array format: [{"question": "...", "type": "${type}", "difficulty": "easy|medium|hard", "topic": "...", "format": "..."}]\n- Ensure variety and challenge`;
    let formatDesc = '';
    switch (type) {
      case 'fill-in-blank':
        formatDesc = 'Format: "Fill in the blank: ________"';
        break;
      case 'case-study':
        formatDesc = 'Format: "Case Study: [Scenario]" with analysis questions';
        break;
      case 'numerical':
        formatDesc = 'Format: "Numerical Problem: [Problem statement]"';
        break;
      case 'conceptual':
        formatDesc = 'Format: "Conceptual Question: [Concept explanation or application]"';
        break;
      case 'mixed':
        formatDesc = 'Format: Mix of all above types';
        break;
      default:
        formatDesc = 'Format: Standard question';
    }
    const userPrompt = `Generate ${type} questions for this syllabus.\n${formatDesc}\nReturn ONLY a JSON array of questions in this format:\n[{"question": "...", "type": "${type}", "difficulty": "easy|medium|hard", "topic": "...", "format": "${formatDesc}"}]\nSyllabus: ${syllabus}`;
    try {
      const client = getGroqClient();
      const response = await client.chat.completions.create({
        model: options.model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature || 0.8,
        max_tokens: options.max_tokens || 4096,
        response_format: { type: 'json_object' },
      });
      let jsonText = response.choices[0]?.message?.content?.trim() || '';
      if (jsonText.startsWith('```json')) jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
      else if (jsonText.startsWith('```')) jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
      const questions = JSON.parse(jsonText);
      results.push({ type, questions });
    } catch (error) {
      results.push({ type, error: error.message });
    }
  }
  return results;
};

/**
 * Validate exam questions for quality and format
 * @param {Array} questions
 * @param {string} type
 * @returns {Object}
 */
export const validateExamQuestions = (questions, type) => {
  const errors = [];
  if (!Array.isArray(questions)) errors.push('Questions must be an array');
  for (const q of questions) {
    if (!q.question || typeof q.question !== 'string') errors.push('Missing question text');
    if (q.type !== type) errors.push(`Type mismatch: expected ${type}`);
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errors.push('Invalid difficulty');
    if (!q.topic || typeof q.topic !== 'string') errors.push('Missing topic');
    if (!q.format || typeof q.format !== 'string') errors.push('Missing format');
  }
  return { valid: errors.length === 0, errors };
};

export default {
  initializeGroqClient,
  getGroqClient,
  generateExamQuestions,
  validateExamQuestions,
};
