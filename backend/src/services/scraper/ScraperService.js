const cron = require('node-cron');
const logger = require('../../config/logger');
const RssScraper = require('./sources/RssScraper');
const GenericHtmlScraper = require('./sources/GenericHtmlScraper');
const GenericApiScraper = require('./sources/GenericApiScraper');

const sources = [
  {
    name: 'FreeJobAlert (RSS)',
    url: 'https://www.freejobalert.com/feed/',
    type: 'rss',
    defaultFields: {
      organization: 'India Government',
      state: 'All India',
      jobType: 'Other',
      qualification: 'Any',
    },
  },
  {
    name: 'Public Job Board (API)',
    url: 'https://arbeitnow.com/api/job-board-api', // Real-time JSON API example
    type: 'api',
    dataPath: 'data', // The array is under 'data' key in response
    fieldMapping: {
      title: 'title',
      url: 'url',
      description: 'description',
      organization: 'company_name',
      category: 'job_types.0', // Array access
      state: 'location',
    },
    defaultFields: {
      jobType: 'Other',
      qualification: 'Any'
    }
  },
  {
    name: 'Staff Selection Commission (HTML)',
    url: 'https://ssc.gov.in/notices', // This is just an example, selectors might need manual tuning
    type: 'html',
    itemSelector: '.notice-item', // Example selector
    fields: {
      titleSelector: 'h3',
      linkSelector: 'a',
      descriptionSelector: 'p',
    },
    defaultFields: {
      organization: 'Staff Selection Commission (SSC)',
      state: 'Central',
      jobType: 'Central Government',
      qualification: 'Various',
    },
  },
];

class ScraperService {
  constructor() {
    this.scrapers = sources.map((source) => {
      if (source.type === 'rss') {
        return new RssScraper(source);
      } else if (source.type === 'html') {
        return new GenericHtmlScraper(source);
      } else if (source.type === 'api') {
        return new GenericApiScraper(source);
      }
      return null;
    }).filter(Boolean);
  }

  async runAll() {
    logger.info('Starting all scrapers...');
    const results = [];
    for (const scraper of this.scrapers) {
      try {
        const result = await scraper.scrape();
        results.push({ name: scraper.name, ...result });
      } catch (error) {
        results.push({ name: scraper.name, error: error.message });
      }
    }
    logger.info('All scrapers finished.');
    return results;
  }

  schedule() {
    // Run every day at 12:00 AM (midnight)
    cron.schedule('0 0 * * *', () => {
      logger.info('Running scheduled scrapers...');
      this.runAll();
    });
    
    // Run at intervals, e.g., every 6 hours
    cron.schedule('0 */6 * * *', () => {
       logger.info('Running incremental scrapers...');
       this.runAll();
    });

    logger.info('Scraper scheduler initialized.');
  }
}

module.exports = new ScraperService();
