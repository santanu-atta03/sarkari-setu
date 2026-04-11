const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../config/logger');

class AdvancedScraperService {
  /**
   * Main entry point for gathering clean text from URL
   */
  async extractText(url) {
    logger.info(`[Scraper] Initiating text extraction for ${url}`);
    
    // Fast HTML Parse using Axios + Cheerio
    let html = await this.fastFetch(url);
    
    // Check if the page lacks content (React/SPA shell typically has low text length)
    const isJsHeavy = html.length < 2000 || html.toLowerCase().includes('you need to enable javascript');
    
    if (isJsHeavy) {
      logger.warn(`[Scraper] Detected JS-heavy or protected page for ${url}, but Puppeteer fallback is disabled. Will attempt extraction on raw HTML anyway.`);
    }
    
    return this.cleanText(html);
  }

  async fastFetch(url) {
    try {
      const response = await axios.get(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000,
        maxRedirects: 5
      });
      return response.data;
    } catch (err) {
      logger.error(`[Scraper] fastFetch failed for ${url}: ${err.message}`);
      return '';
    }
  }

  cleanText(html) {
    if (!html) return '';
    const $ = cheerio.load(html);
    
    // Delete noisy elements
    $('script, style, nav, footer, header, aside, .advertisement, noscript, svg, img, iframe').remove();
    
    // Return sanitized plain text
    return $('body').text()
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = new AdvancedScraperService();
