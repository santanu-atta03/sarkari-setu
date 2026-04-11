/**
 * AI Service
 * 
 * Handles interaction with Groq (and fallback Google Gemini) API to extract structured 
 * data from unstructured government job notifications accurately and quickly.
 */

const axios = require('axios');
const logger = require('../config/logger');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

class AiService {
  /**
   * Extract job details from text or HTML using Groq / Gemini
   * @param {string} content - The text or HTML content of the job notification
   * @returns {Promise<Object>} - Structured job data
   */
  async extractJobData(content) {
    try {
      const geminiKey = process.env.GEMINI_API_KEY;
      const groqKey = process.env.GROQ_API_KEY;
      
      if (!geminiKey && !groqKey) {
        throw new Error('Neither GROQ_API_KEY nor GEMINI_API_KEY is configured');
      }

      const prompt = `
        Extrapolate the following government job notification into a structured JSON format. 
        The JSON must match this schema as closely as possible:
        {
          "title": "Full job title",
          "organization": "Agency name (e.g., SSC, UPSC, Indian Railways)",
          "department": "Specific department if any",
          "state": "State name (use 'All India' for central jobs)",
          "jobType": "One of: Central Government, State Government, PSU, Defence, Police, Railway, Banking, Teaching, Engineering, Medical, Other",
          "category": "Broad category like SSC, UPSC, IBPS, etc.",
          "qualification": "One of: 8th Pass, 10th Pass, 12th Pass, Diploma, Graduate, Post Graduate, PhD, Any",
          "shortDescription": "A 2-3 sentence summary",
          "applicationFee": { "general": 0, "obc": 0, "scSt": 0, "female": 0 },
          "importantDates": { "applicationStart": "YYYY-MM-DD", "applicationEnd": "YYYY-MM-DD" },
          "vacancy": { "total": 0 },
          "eligibility": { "minAge": 18, "maxAge": 40, "qualifications": ["list of strings"] },
          "salaryMin": 0,
          "salaryMax": 0
        }

        Notification Content:
        ${content.substring(0, 6000)} // Truncate rigorously to avoid Groq TPM limits

        Return ONLY the JSON. No conversational text.
      `;

      let resultText = '';

      if (groqKey) {
        const payload = {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You strictly return valid JSON without markdown wrapping.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        };

        const response = await axios.post(GROQ_URL, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          timeout: 30000
        });

        resultText = response.data?.choices?.[0]?.message?.content;
      } else if (geminiKey) {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: "application/json",
            }
          }
        );

        resultText = response.data.candidates[0].content.parts[0].text;
      }

      if (!resultText) throw new Error('Empty response from AI provider');

      // Cleanup fallback
      const cleaned = resultText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      logger.error('Error in AI extraction:', errorMsg);
      return null;
    }
  }
}

module.exports = new AiService();
