const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../../../models/Job');
const logger = require('../../../config/logger');

class GenericHtmlScraper {
  constructor(sourceConfig) {
    this.name = sourceConfig.name;
    this.url = sourceConfig.url;
    this.itemSelector = sourceConfig.itemSelector;
    this.fields = sourceConfig.fields; // Mapper for fields: { titleSelector, etc. }
    this.defaultFields = sourceConfig.defaultFields || {};
  }

  async scrape() {
    try {
      logger.info(`Starting HTML scrape for ${this.name} (${this.url})`);
      const { data } = await axios.get(this.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(data);
      let newCount = 0;
      let skippedCount = 0;

      const items = $(this.itemSelector);
      logger.info(`Found ${items.length} items to parse.`);

      for (let i = 0; i < items.length; i++) {
        const item = $(items[i]);
        
        // Extract link/sourceUrl first for duplicate check
        const linkElem = this.fields.linkSelector ? item.find(this.fields.linkSelector) : item;
        let sourceUrl = linkElem.attr('href') || linkElem.find('a').attr('href');
        
        // Handle relative URLs
        if (sourceUrl && !sourceUrl.startsWith('http')) {
          const base = new URL(this.url).origin;
          sourceUrl = new URL(sourceUrl, base).href;
        }

        if (!sourceUrl) {
           skippedCount++;
           continue;
        }

        const existingJob = await Job.findOne({ sourceUrl });
        if (existingJob) {
          skippedCount++;
          continue;
        }

        const jobData = {
          title: item.find(this.fields.titleSelector).text().trim(),
          sourceUrl,
          status: 'draft',
          ...this.defaultFields,
          organization: this.defaultFields.organization || 'Government',
          state: this.defaultFields.state || 'All India',
          jobType: this.defaultFields.jobType || 'Other',
          qualification: this.defaultFields.qualification || 'Any',
          shortDescription: item.find(this.fields.descriptionSelector).text().trim() || 'No description available',
        };

        if (!jobData.title) {
            skippedCount++;
            continue;
        }

        const job = new Job(jobData);
        await job.save();
        newCount++;
      }

      logger.info(`Finished HTML scrape for ${this.name}: ${newCount} new jobs, ${skippedCount} skipped.`);
      return { newCount, skippedCount };
    } catch (error) {
      logger.error(`Error scraping ${this.name}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = GenericHtmlScraper;
