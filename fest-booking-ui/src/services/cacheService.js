class CacheService {
    constructor() {
        this.cache = new Map();
        this.expiryTimes = new Map();
    }

    // Set cache with optional expiry
    set(key, value, expiryMs = 300000) { // 5 minutes default
        this.cache.set(key, value);

        if (expiryMs > 0) {
            const expiryTime = Date.now() + expiryMs;
            this.expiryTimes.set(key, expiryTime);

            // Auto cleanup after expiry
            setTimeout(() => {
                this.delete(key);
            }, expiryMs);
        }
    }

    // Get cached value
    get(key) {
        // Check if expired
        if (this.expiryTimes.has(key)) {
            const expiryTime = this.expiryTimes.get(key);
            if (Date.now() > expiryTime) {
                this.delete(key);
                return null;
            }
        }

        return this.cache.get(key) || null;
    }

    // Check if key exists
    has(key) {
        // Check expiry
        if (this.expiryTimes.has(key)) {
            const expiryTime = this.expiryTimes.get(key);
            if (Date.now() > expiryTime) {
                this.delete(key);
                return false;
            }
        }

        return this.cache.has(key);
    }

    // Delete cache entry
    delete(key) {
        this.cache.delete(key);
        this.expiryTimes.delete(key);
    }

    // Clear all cache
    clear() {
        this.cache.clear();
        this.expiryTimes.clear();
    }

    // Get cache size
    size() {
        return this.cache.size;
    }

    // Get or set pattern (fetch if not cached)
    async getOrSet(key, fetchFn, expiryMs = 300000) {
        if (this.has(key)) {
            return this.get(key);
        }

        const value = await fetchFn();
        this.set(key, value, expiryMs);
        return value;
    }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService;
