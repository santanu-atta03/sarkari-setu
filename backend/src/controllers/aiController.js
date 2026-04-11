/**
 * AI Controller — SarkariSetu
 *
 * Uses Google Gemini Flash to intelligently extract structured job data
 * from a notification URL or raw pasted text. Reduces admin manual work
 * by 80-90% by pre-filling the entire job form automatically.
 */

const axios = require('axios');
const cheerio = require('cheerio');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// We now use Groq as the primary free, fast, and accurate AI. 
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Scrape text content from a URL using axios + cheerio.
 * Returns cleaned plain text (removes scripts, styles, nav, footer).
 */
async function scrapeUrl(url) {
  const response = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
    },
    maxRedirects: 5,
  });

  const $ = cheerio.load(response.data);

  // Remove noisy DOM elements
  $('script, style, nav, footer, header, .ad, .advertisement, .sidebar, iframe, noscript').remove();

  // Extract meaningful text
  const text = $('body').text().replace(/\s+/g, ' ').trim();

  // Limit to ~6000 chars to stay safely below Groq's 12k TPM free-tier limit 
  // (input tokens + max_tokens requested = TPM)
  return text.substring(0, 6000);
}

/**
 * Build the Gemini prompt for job data extraction.
 */
function buildPrompt(rawText) {
  return `You are an expert at extracting structured data from Indian government job notifications (Sarkari Naukri). 

Extract ALL possible information from the following notification text and return a SINGLE valid JSON object. Be thorough and extract every piece of data you can find.

IMPORTANT RULES:
1. Return ONLY raw JSON — no markdown, no code fences, no explanation.
2. For any field you cannot find, use null (for strings/numbers) or [] (for arrays) or 0 (for fee/vacancy numbers).
3. For dates, use ISO 8601 format: "YYYY-MM-DD". If only month/year given, use the 1st of that month.
4. jobType must be exactly ONE of: "Central Government", "State Government", "PSU", "Defence", "Police", "Railway", "Banking", "Teaching", "Engineering", "Medical", "Other"
5. qualification must be exactly ONE of: "8th Pass", "10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate", "PhD", "Any"
6. salaryUnit must be: "monthly", "annual", or "daily"
7. Tags should be 5-10 lowercase keywords relevant to this job.
8. For shortDescription, write a compelling 2-3 sentence summary (max 500 chars).
9. For fullContent, create a well-formatted HTML summary with key sections like Vacancy Details, Eligibility, Important Dates, How to Apply.
10. For SEO: generate a good metaTitle (max 70 chars) and metaDescription (max 155 chars).
11. For FAQs, generate 3-5 frequently asked questions about this job with clear answers.

Return this exact JSON structure:
{
  "title": "Job title (e.g. SSC MTS Recruitment 2025)",
  "organization": "Full organization name",
  "department": "Department name if any",
  "state": "State name or 'All India' for central jobs",
  "district": "",
  "jobType": "One of the allowed values",
  "category": "e.g. SSC, UPSC, IBPS, Railway, etc.",
  "qualification": "One of the allowed values",
  "shortDescription": "2-3 sentence summary",
  "fullContent": "<h2>Full HTML content</h2>",
  "notificationPdfUrl": "URL to PDF if found, else null",
  "applyOnlineUrl": "URL to apply online if found, else null",
  "officialWebsite": "Official website URL if found, else null",
  "eligibility": {
    "minAge": 18,
    "maxAge": 27,
    "ageRelaxation": "Age relaxation as per rules",
    "qualifications": ["Graduate in any stream"],
    "experience": "",
    "otherCriteria": ""
  },
  "importantDates": {
    "applicationStart": "YYYY-MM-DD or null",
    "applicationEnd": "YYYY-MM-DD or null",
    "examDate": "YYYY-MM-DD or null",
    "admitCardDate": "YYYY-MM-DD or null",
    "resultDate": "YYYY-MM-DD or null"
  },
  "applicationFee": {
    "general": 0,
    "obc": 0,
    "scSt": 0,
    "exServicemen": 0,
    "female": 0,
    "paymentMode": "Online"
  },
  "vacancy": {
    "total": 0,
    "general": 0,
    "obc": 0,
    "sc": 0,
    "st": 0,
    "ews": 0,
    "ph": 0,
    "breakdown": [
      { "post": "Post name", "count": 0 }
    ]
  },
  "salaryMin": null,
  "salaryMax": null,
  "salaryUnit": "monthly",
  "tags": ["tag1", "tag2"],
  "seo": {
    "metaTitle": "SEO title max 70 chars",
    "metaDescription": "SEO description max 155 chars",
    "keywords": ["keyword1", "keyword2"]
  },
  "faqs": [
    { "question": "Question?", "answer": "Answer." }
  ]
}

--- NOTIFICATION TEXT TO EXTRACT FROM ---
${rawText}
--- END ---`;
}

/**
 * Call Groq API with prompt and return parsed JSON.
 */
async function callGroq(prompt) {
  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI assistant that strictly returns valid JSON only. Do not wrap the JSON in markdown formatting.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.1,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  };

  const response = await axios.post(GROQ_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    timeout: 30000,
  });

  const rawText = response.data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error('Groq returned empty response');
  }

  // Fallback cleanup just in case
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

/**
 * Call Gemini API as a fallback
 */
async function callGemini(prompt) {
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.1,        // Low temp for factual extraction
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  };

  const response = await axios.post(GEMINI_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  });

  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini returned empty response');
  }

  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * POST /api/ai/extract-job
 *
 * Body: { url?: string, text?: string }
 * Returns: { success: true, data: { ...jobFields } }
 */
exports.extractJob = async (req, res) => {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({
      success: false,
      message: 'Provide either a notification URL or raw text to extract from.',
    });
  }

  if (!GROQ_API_KEY && !GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      message: 'AI service is not configured. Add GROQ_API_KEY (Get free key from console.groq.com) or GEMINI_API_KEY to your .env file.',
    });
  }

  let rawContent = text || '';

  // If URL provided, scrape page content
  if (url && !text) {
    try {
      let targetUrl = url.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      rawContent = await scrapeUrl(targetUrl);
    } catch (scrapeErr) {
      // Some sites block scrapers — ask user to paste text manually
      return res.status(422).json({
        success: false,
        message: `Could not fetch content from the URL. The site might be blocking us or the URL is invalid. Try pasting the text directly.`,
        code: 'SCRAPE_FAILED',
      });
    }
  }

  if (rawContent.length < 50) {
    return res.status(422).json({
      success: false,
      message: 'The content scraped from the page was too short. Please paste the notification text manually.',
    });
  }

  // Build prompt and call Provider
  const prompt = buildPrompt(rawContent);
  let extracted;

  try {
    if (GROQ_API_KEY) {
      extracted = await callGroq(prompt);
    } else {
      extracted = await callGemini(prompt);
    }
  } catch (err) {
    console.error('AI extraction error:', err.response?.data || err.message);
    const status = err.response?.status;
    const data = err.response?.data;
    
    if (status === 401 && data?.error?.message?.includes('API key')) {
       return res.status(502).json({
         success: false,
         message: 'Your Groq or Gemini API Key is invalid. Get a free one and add it to your .env file.'
       });
    }

    // Attempt fallback from Groq to Gemini if both keys are present
    if (GROQ_API_KEY && GEMINI_API_KEY) {
       console.log('Groq failed, attempting Gemini fallback...');
       try {
           extracted = await callGemini(prompt);
       } catch(fallbackErr) {
           return res.status(502).json({
             success: false,
             message: 'AI extraction failed on both providers. Text may be too complex or unsupported.',
             error: fallbackErr.message,
           });
       }
    } else {
       return res.status(502).json({
         success: false,
         message: 'AI extraction failed. The API might be restricted or text may be in an unsupported format.',
         error: err.message,
       });
    }
  }

  return res.json({
    success: true,
    message: 'Job data extracted successfully',
    data: extracted,
    meta: {
      sourceUrl: url || null,
      charsProcessed: rawContent.length,
      extractedAt: new Date().toISOString(),
    },
  });
};
