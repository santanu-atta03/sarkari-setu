/**
 * Scraper Service
 * 
 * Handles crawling government websites and discovering new job links.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const pdf = require('pdf-parse');
const logger = require('../config/logger');

class ScraperService {
  /**
   * Scrape a list of URLs from a target page
   * @param {string} url - The page to scrape links from
   * @param {string} selector - CSS selector for the links
   * @returns {Promise<Array>} - List of discoverd links
   */
  async discoverLinks(url, selector = 'a') {
    try {
      // Special Handling for SSC (since it uses a REST API)
      if (url.includes('ssc.gov.in')) {
        const sscApi = 'https://ssc.gov.in/api/general-website/portal/records?contentType=notice-boards&isAttachment=true&limit=10&page=1';
        const response = await axios.get(sscApi);
        const notices = response.data.data || []; 
        return notices.map((item) => ({
          title: item.headline,
          url: `https://ssc.gov.in/api/attachment/${item.attachments?.[0]?.path?.replace(/\\/g, '/')}`
        }));
      }

      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (Chrome/119.0.0.0) Safari/537.36'
        }
      });
      const $ = cheerio.load(data);
      const links = [];

      $(selector).each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (href && (href.includes('notification') || href.includes('recruitment') || href.includes('.pdf'))) {
          // Resolve relative URLs
          const absoluteUrl = new URL(href, url).href;
          links.push({ title: text, url: absoluteUrl });
        }
      });

      return links;
    } catch (error) {
      logger.error(`Error scraping ${url}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch content of a page or PDF for AI processing
   */
  async fetchPageContent(url) {
    try {
      const response = await axios.get(url, {
        responseType: url.endsWith('.pdf') ? 'arraybuffer' : 'text',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (url.endsWith('.pdf')) {
        const data = await pdf(response.data);
        return data.text;
      }

      const $ = cheerio.load(response.data);
      // Remove noise
      $('script, style, nav, footer, header').remove();
      return $('body').text().replace(/\s+/g, ' ').trim();
    } catch (error) {
       logger.error(`Error fetching content from ${url}:`, error.message);
       return '';
    }
  }
}

module.exports = new ScraperService();
