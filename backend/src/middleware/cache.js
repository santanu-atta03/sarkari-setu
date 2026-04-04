/**
 * Simple In-memory Caching Middleware
 * 
 * Stores the results of GET requests for a duration (default 5 minutes).
 * Only caches successful responses (200 OK).
 * 
 * In a production environment, Redis would be a better alternative.
 */

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 min TTL

const cacheMiddleware = (duration = 300) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Create a unique key for the request (URL + Query Params)
  const key = `cache_${req.originalUrl || req.url}`;
  const cachedResponse = myCache.get(key);

  if (cachedResponse) {
    console.log(`[Cache] HIT: ${key}`);
    return res.status(200).json(cachedResponse);
  } else {
    console.log(`[Cache] MISS: ${key}`);
    // Monkey-patch res.json to catch the response and cache it
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful, non-error data
      if (res.statusCode >= 200 && res.statusCode < 300 && body.success !== false) {
        myCache.set(key, body, duration);
      }
      return originalJson.call(res, body);
    };
    next();
  }
};

/**
 * Helper to clear a specific cache key (e.g., when a job is updated)
 */
const clearCache = (pattern) => {
  const keys = myCache.keys();
  const keysToDelete = keys.filter(k => k.includes(pattern));
  myCache.del(keysToDelete);
  if (keysToDelete.length > 0) {
     console.log(`[Cache] Cleared ${keysToDelete.length} keys matching pattern: ${pattern}`);
  }
};

module.exports = { cacheMiddleware, clearCache };
