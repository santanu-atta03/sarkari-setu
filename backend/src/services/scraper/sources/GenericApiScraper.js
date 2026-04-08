const axios = require('axios');
const Job = require('../../../models/Job');
const logger = require('../../../config/logger');

class GenericApiScraper {
  constructor(sourceConfig) {
    this.name = sourceConfig.name;
    this.url = sourceConfig.url;
    this.method = sourceConfig.method || 'GET';
    this.headers = sourceConfig.headers || {};
    this.queryParams = sourceConfig.queryParams || {};
    this.dataPath = sourceConfig.dataPath; // e.g., 'data.jobs' to help find the array in response
    this.fieldMapping = sourceConfig.fieldMapping || {};
    this.defaultFields = sourceConfig.defaultFields || {};
  }

  // Utility to get nested property from object by string path (e.g. 'data.items')
  getNestedProperty(obj, path) {
    if (!path) return obj;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  async scrape() {
    try {
      logger.info(`Starting API scrape for ${this.name} (${this.url})`);
      
      const response = await axios({
        method: this.method,
        url: this.url,
        headers: this.headers,
        params: this.queryParams,
        timeout: 10000,
      });

      const items = this.getNestedProperty(response.data, this.dataPath);

      if (!Array.isArray(items)) {
         throw new Error(`Data path '${this.dataPath}' did not point to an array. Found: ${typeof items}`);
      }

      let newCount = 0;
      let skippedCount = 0;

      for (const item of items) {
        // Map API fields to Job fields based on field mapping configuration
        const title = this.getNestedProperty(item, this.fieldMapping.title) || this.defaultFields.title;
        let sourceUrl = this.getNestedProperty(item, this.fieldMapping.url);
        
        // Ensure sourceUrl exists for duplicate check logic. If API doesn't provide one, generate a hash or mock one
        if (!sourceUrl) {
            sourceUrl = `api-${this.name}-${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
        }

        // Check for duplicates
        const existingJob = await Job.findOne({ sourceUrl });
        if (existingJob) {
          skippedCount++;
          continue;
        }

        const shortDescription = this.getNestedProperty(item, this.fieldMapping.description) || 
                                 title || 
                                 'Details not available';

        const organization = this.getNestedProperty(item, this.fieldMapping.organization) || 
                             this.defaultFields.organization || 
                             'Various';

        // Map optional info
        const category = this.getNestedProperty(item, this.fieldMapping.category) || this.defaultFields.category || '';
        const state = this.getNestedProperty(item, this.fieldMapping.state) || this.defaultFields.state || 'All India';

        const jobData = {
          title: title.substring(0, 199),
          shortDescription: shortDescription.substring(0, 499),
          sourceUrl: sourceUrl,
          organization: organization.substring(0, 199),
          state: state,
          category: category,
          status: 'draft', // Draft status for admin review
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

module.exports = GenericApiScraper;
