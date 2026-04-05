/**
 * Trending Service
 *
 * Handles logic for recalculating trending scores for all jobs.
 * This can be run periodically via a cron job or stimulated by activity.
 */

const Job = require('../models/Job');

/**
 * Recalculate scores for all published jobs that are not expired.
 * This accounts for time-decay.
 */
exports.recalculateAllScores = async () => {
  const jobs = await Job.find({ status: 'published' });
  
  const updates = jobs.map(job => {
    job.calculateTrendingScore();
    return job.save({ validateBeforeSave: false }); // Skip validation for speed on background task
  });

  await Promise.all(updates);
  console.log(`[TrendingService] Recalculated trending scores for ${jobs.length} jobs.`);
};

/**
 * Increment a specific metric and update the job's trending score atomically.
 * @param {string} jobId - The ObjectId of the job
 * @param {string} field - The field to increment (viewCount, bookmarkCount, etc.)
 */
exports.updateMetricAndScore = async (jobId, field) => {
  const job = await Job.findById(jobId);
  if (!job) return null;

  job[field] = (job[field] || 0) + 1;
  job.calculateTrendingScore();
  
  await job.save({ validateBeforeSave: false });
  return job;
};
