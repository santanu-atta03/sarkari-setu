const JobExtractionTask = require('../models/JobExtractionTask');
const AdvancedScraperService = require('../services/AdvancedScraperService');
const AIPipelineService = require('../services/AIPipelineService');
const logger = require('../config/logger');

// Simplistic in-memory concurrency queue (since Redis might not be installed locally on Windows)
const queue = [];
let isProcessing = false;

const processNext = async () => {
  if (isProcessing || queue.length === 0) return;
  
  isProcessing = true;
  const taskId = queue.shift();
  
  try {
    const task = await JobExtractionTask.findById(taskId);
    if (!task) {
      isProcessing = false;
      return processNext();
    }
    
    task.status = 'processing';
    await task.save();
    
    // Step 1: Scrape
    const cleanedText = await AdvancedScraperService.extractText(task.url);
    if (!cleanedText || cleanedText.length < 50) {
      throw new Error("Could not extract meaningful text from URL. Might be a captcha or protected page.");
    }
    
    // Step 2 & 3: Run AI Pipeline
    const structuredData = await AIPipelineService.processJobData(cleanedText, task.url);
    
    // Success
    task.status = 'completed';
    task.resultData = structuredData;
    await task.save();
    logger.info(`[Extraction Queue] Completed task: ${taskId}`);
  } catch (error) {
    logger.error(`[Extraction Queue] Task ${taskId} failed:`, error.message);
    
    try {
      await JobExtractionTask.findByIdAndUpdate(taskId, {
        status: 'failed',
        errorMessage: error.message
      });
    } catch (e) {
      logger.error('Failed to update task error state');
    }
  }
  
  isProcessing = false;
  
  // Wait a small moment then process next to avoid spiking CPU
  setTimeout(processNext, 1000);
};

exports.startExtraction = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  // Format URL if missing protocol
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const task = await JobExtractionTask.create({ url: targetUrl, status: 'pending' });
    
    // Dispatch to in-memory pseudo-worker
    queue.push(task._id);
    processNext(); // Trigger processing if idle

    return res.status(202).json({
      success: true,
      message: 'Extraction started in the background.',
      trackingId: task._id
    });
  } catch (error) {
    logger.error('startExtraction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExtractionStatus = async (req, res) => {
  const { trackingId } = req.params;
  
  try {
    const task = await JobExtractionTask.findById(trackingId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tracking ID not found.' });
    }
    
    return res.json({
      success: true,
      data: {
        status: task.status,
        resultData: task.resultData,
        errorMessage: task.errorMessage
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
