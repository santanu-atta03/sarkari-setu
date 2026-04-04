# Scraping Service Implementation Walkthrough

The Scraping Service is designed to automatically fetch government job postings from various sources (RSS feeds and HTML pages), parse them into a structured format, and store them in the MongoDB database while preventing duplicates.

## 1. Directory Structure
Created a modular structure for the scraping service:
- `backend/src/services/scraper/ScraperService.js`: The main orchestrator and scheduler.
- `backend/src/services/scraper/sources/RssScraper.js`: Handles RSS-based sources.
- `backend/src/services/scraper/sources/GenericHtmlScraper.js`: Handles HTML-based sources using Cheerio selectors.
- `backend/src/config/logger.js`: A simple logging utility for service tracking.

## 2. Model Updates
Updated `backend/src/models/Job.js` to include:
- `sourceUrl`: Tracks the origin URL of the scraped job. This is used as a unique identifier to prevent duplicate entries from multiple scraping runs or different sources.

## 3. Core Implementation

### RSS Scraper
Uses `rss-parser` to fetch feeds. It maps standard RSS fields (`title`, `link`, `contentSnippet`) to the `Job` model. All scraped jobs are initially saved as `draft` status for admin review.

### HTML Scraper
Uses `axios` for fetching and `cheerio` for parsing. It allows configuring `itemSelector` and specific field selectors (`titleSelector`, `linkSelector`, `descriptionSelector`) to adapt to different website structures.

### Orchestrator & Scheduling
`ScraperService.js` manages a list of configured sources. It includes:
- `runAll()`: Executes all scrapers sequentially.
- `schedule()`: Uses `node-cron` to run scraping tasks periodically (e.g., daily at midnight and every 6 hours).

## 4. Manual Trigger
Added an express route `/api/scraper/run` in `src/routes/scraperRoutes.js` and registered it in `src/app.js`. This allows administrators to manually trigger the scraping process via the API.

## 5. Duplicate Prevention
Before saving any scraped job, the service checks if a job with the same `sourceUrl` already exists in the database. If found, it skips the entry, ensuring the database remains clean.

## Next Steps
- [ ] Tune CSS selectors for specific government websites (e.g., SSC, UPSC).
- [ ] Implement advanced parsing for eligibility, important dates, and vacancy details from the scraped content.
- [ ] Add more sources to the `sources` array in `ScraperService.js`.
