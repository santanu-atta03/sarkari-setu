/**
 * Ingestion Controller
 * 
 * Orchestrates the data flow: Scrape -> Parse -> AI -> Draft Job
 */

const ScraperService = require('../services/ScraperService');
const AiService = require('../services/AiService');
const Job = require('../models/Job');
const logger = require('../config/logger');

exports.triggerCrawl = async (req, res) => {
  const { url, selector } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, message: 'Source URL is required' });
  }

  try {
    logger.info(`Starting crawl for: ${url}`);
    const links = await ScraperService.discoverLinks(url, selector);
    
    // For demo purposes, we'll only process the first 2 links to save tokens
    const processedJobs = [];
    for (const link of links.slice(0, 2)) {
      // Check if we already have this URL
      const existing = await Job.findOne({ sourceUrl: link.url });
      if (existing) continue;

      const fullContent = await ScraperService.fetchPageContent(link.url);
      const aiData = await AiService.extractJobData(fullContent);

      if (aiData) {
        const newJob = await Job.create({
          ...aiData,
          sourceUrl: link.url,
          status: 'draft',
          organization: aiData.organization || 'Unknown', // Fallback
          state: aiData.state || 'All India',
          shortDescription: aiData.shortDescription || 'No description available',
          importantDates: {
             ...aiData.importantDates,
             applicationStart: aiData.importantDates?.applicationStart ? new Date(aiData.importantDates.applicationStart) : null,
             applicationEnd: aiData.importantDates?.applicationEnd ? new Date(aiData.importantDates.applicationEnd) : null,
          }
        });
        processedJobs.push(newJob);
      }
    }

    res.status(200).json({
      success: true,
      message: `Crawl complete. Discovered ${links.length} links, processed ${processedJobs.length} new drafts.`,
      data: processedJobs
    });
  } catch (error) {
    logger.error('Crawl Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDrafts = async (req, res) => {
  const drafts = await Job.find({ status: 'draft' }).sort({ createdAt: -1 });
  res.json({ success: true, data: drafts });
};

exports.publishJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, { status: 'published' }, { new: true });
  res.json({ success: true, data: job });
};
