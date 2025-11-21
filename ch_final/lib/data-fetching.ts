// Utility functions for optimized data fetching with caching

// In-memory cache for client-side data
const cache = new Map<string, { data: any; timestamp: number; expires: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch data with improved caching
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @param cacheDuration - Cache duration in milliseconds (default: 5 minutes)
 * @returns Promise with fetched data
 */
export async function fetchWithCache(url: string, options: RequestInit = {}, cacheDuration: number = CACHE_DURATION) {
  const now = Date.now();
  
  // Create a cache key that includes the URL and any credentials
  // This ensures that different users get different cache entries
  const cacheKey = `${url}-${JSON.stringify(options.credentials || '')}`;
  
  // Check if we have valid cached data
  const cached = cache.get(cacheKey);
  if (cached && now < cached.expires) {
    console.log(`Returning cached data for ${cacheKey}`);
    return cached.data;
  }
  
  // Show loading state in console for debugging
  console.log(`Fetching fresh data for ${cacheKey}`);
  
  try {
    // Fetch fresh data with optimized headers
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the data with expiration time
    const expires = now + cacheDuration;
    cache.set(cacheKey, { data, timestamp: now, expires });
    
    return data;
  } catch (error) {
    // If fetch fails but we have cached data, return stale data
    const cached = cache.get(cacheKey);
    if (cached) {
      console.warn(`Fetch failed for ${cacheKey}, returning stale cached data`, error);
      return cached.data;
    }
    // If no cached data, re-throw the error
    throw error;
  }
}

/**
 * Clear cache for a specific URL
 * @param url - The URL to clear from cache
 */
export function clearCache(url: string) {
  // Clear cache entries that match the URL
  for (const key of cache.keys()) {
    if (key.startsWith(url)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Fetch multiple endpoints in parallel with caching
 * @param urls - Array of URLs to fetch
 * @param options - Fetch options for all requests
 * @returns Promise with array of fetched data
 */
export async function fetchMultipleWithCache(urls: string[], options: RequestInit = {}) {
  const promises = urls.map(url => fetchWithCache(url, options));
  return Promise.all(promises);
}

/**
 * Invalidate expired cache entries
 */
export function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now >= value.expires) {
      cache.delete(key);
    }
  }
}

// Cleanup expired cache entries every 10 minutes
setInterval(cleanupExpiredCache, 10 * 60 * 1000);