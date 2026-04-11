const axios = require('axios');
const logger = require('../config/logger');

class AIPipelineService {
  constructor() {
    this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    // Load dynamically to ensure env vars are ready
  }

  async processJobData(cleanedText, url) {
    logger.info(`[AIPipeline] Step 1: Starting AI extraction for ${url}`);
    
    // Step 1: Extraction
    const rawExtraction = await this.extract(cleanedText);
    
    logger.info(`[AIPipeline] Step 2: Normalization`);
    // Step 2: Normalization
    const normalizedData = this.normalize(rawExtraction);
    
    logger.info(`[AIPipeline] Step 3: Validation`);
    // Step 3: Validation
    const validatedJson = this.validate(normalizedData, url);
    
    return validatedJson;
  }

  /**
   * Step 1: LLM Extraction
   */
  async extract(text) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

    const prompt = `
      Extract structural job data from this text. Respond in strictly valid JSON format.
      Fields required: title, organization, state, jobType, category, qualification, shortDescription, applicationFee (object with general, obc, scSt, female), importantDates (object with applicationStart, applicationEnd), vacancy (object with total), eligibility (object with minAge, maxAge, qualifications), salaryMin, salaryMax.
      
      If a field is missing, use null or 0 accordingly.
      
      Content: ${text.substring(0, 10000)}
    `;

    const response = await axios.post(
      this.groqUrl,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You strictly output JSON only. No markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      },
      { headers: { 'Authorization': `Bearer ${apiKey}` }, timeout: 45000 }
    );

    const jsonText = response.data.choices[0].message.content;
    try {
        return JSON.parse(jsonText);
    } catch {
        // Simple auto-fix fallback for weird JSON wraps
        return JSON.parse(jsonText.replace(/^```json/i, '').replace(/```$/, '').trim());
    }
  }

  /**
   * Step 2: Normalization
   */
  normalize(data) {
    // Standardize locations, empty strings to nulls, trim spaces
    return {
      title: data.title?.trim() || null,
      organization: data.organization?.trim() || null,
      state: data.state?.trim() || null,
      jobType: data.jobType?.trim() || 'Central Government',
      category: data.category?.trim() || 'Other',
      qualification: data.qualification?.trim() || 'Any',
      shortDescription: data.shortDescription?.trim() || null,
      applicationFee: {
        general: parseInt(data.applicationFee?.general) || 0,
        obc: parseInt(data.applicationFee?.obc) || 0,
        scSt: parseInt(data.applicationFee?.scSt) || 0,
        female: parseInt(data.applicationFee?.female) || 0
      },
      importantDates: {
        applicationStart: data.importantDates?.applicationStart || null,
        applicationEnd: data.importantDates?.applicationEnd || null
      },
      vacancy: {
        total: parseInt(data.vacancy?.total) || 0
      },
      eligibility: {
        minAge: parseInt(data.eligibility?.minAge) || 18,
        maxAge: parseInt(data.eligibility?.maxAge) || 40,
        qualifications: Array.isArray(data.eligibility?.qualifications) 
          ? data.eligibility.qualifications 
          : []
      },
      salaryMin: parseInt(data.salaryMin) || null,
      salaryMax: parseInt(data.salaryMax) || null
    };
  }

  /**
   * Step 3: Validation
   */
  validate(data, url) {
    // Basic validation check
    if (!data.title || data.title.length < 3) {
        throw new Error('Critical Error: Failed to identify a valid Job Title from the content.');
    }
    
    // Add context
    data.sourceUrl = url;
    
    return data;
  }
}

module.exports = new AIPipelineService();
