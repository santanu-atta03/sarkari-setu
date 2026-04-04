const Parser = require('rss-parser');
const Job = require('../../models/Job');
const logger = require('../../config/logger'); // assuming logger exists, if not I'll create or check existing

const parser = new Parser();

class RssScraper {
  constructor(sourceConfig) {
    this.name = sourceConfig.name;
    this.url = sourceConfig.url;
    this.defaultFields = sourceConfig.defaultFields || {};
  }

  async scrape() {
    try {
      logger.info(`Starting RSS scrape for ${this.name} (${this.url})`);
      const feed = await parser.parseURL(this.url);
      
      let newCount = 0;
      let skippedCount = 0;

      for (const item of feed.items) {
        // Check for duplicates
        const existingJob = await Job.findOne({ sourceUrl: item.link });
        if (existingJob) {
          skippedCount++;
          continue;
        }

        // Map RSS item to Job model
        const jobData = {
          title: item.title,
          shortDescription: item.contentSnippet || item.content || item.title,
          sourceUrl: item.link,
          status: 'draft', // By default, all scraped jobs are draft for admin review
          ...this.defaultFields,
          // Extract more if possible, else default to generic
          organization: this.defaultFields.organization || item.author || 'Unknown',
          state: this.defaultFields.state || 'All India',
          jobType: this.defaultFields.jobType || 'Other',
          qualification: this.defaultFields.qualification || 'Any',
        };

        const job = new Job(jobData);
        await job.save();
        newCount++;
      }

      logger.info(`Finished scrape for ${this.name}: ${newCount} new jobs, ${skippedCount} skipped.`);
      return { newCount, skippedCount };
    } catch (error) {
      logger.error(`Error scraping ${this.name}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RssScraper;
