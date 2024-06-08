// src/utils/cache.js
const cacheManager = require('cache-manager');
const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: 60 /* seconds */ });

module.exports = memoryCache;
