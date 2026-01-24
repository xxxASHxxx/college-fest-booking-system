// Secure localStorage wrapper
class SecureStorage {
    constructor(prefix = 'festbook_') {
        this.prefix = prefix;
    }

    // Generate key with prefix
    _getKey(key) {
        return `${this.prefix}${key}`;
    }

    // Set item
    setItem(key, value, encrypt = false) {
        try {
            const data = encrypt ? this._encrypt(value) : value;
            const serialized = JSON.stringify({
                value: data,
                timestamp: Date.now(),
                encrypted: encrypt,
            });
            localStorage.setItem(this._getKey(key), serialized);
            return true;
        } catch (error) {
            console.error('Storage setItem error:', error);
            return false;
        }
    }

    // Get item
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this._getKey(key));
            if (!item) return defaultValue;

            const { value, encrypted } = JSON.parse(item);
            return encrypted ? this._decrypt(value) : value;
        } catch (error) {
            console.error('Storage getItem error:', error);
            return defaultValue;
        }
    }

    // Remove item
    removeItem(key) {
        try {
            localStorage.removeItem(this._getKey(key));
            return true;
        } catch (error) {
            console.error('Storage removeItem error:', error);
            return false;
        }
    }

    // Clear all items with prefix
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    // Check if key exists
    hasItem(key) {
        return localStorage.getItem(this._getKey(key)) !== null;
    }

    // Get all keys
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter((key) => key.startsWith(this.prefix))
            .map((key) => key.replace(this.prefix, ''));
    }

    // Simple encryption (base64 for demo - use proper encryption in production)
    _encrypt(value) {
        return btoa(JSON.stringify(value));
    }

    // Simple decryption
    _decrypt(value) {
        return JSON.parse(atob(value));
    }

    // Set with expiry
    setWithExpiry(key, value, ttl) {
        const item = {
            value,
            expiry: Date.now() + ttl,
        };
        localStorage.setItem(this._getKey(key), JSON.stringify(item));
    }

    // Get with expiry check
    getWithExpiry(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this._getKey(key));
            if (!item) return defaultValue;

            const { value, expiry } = JSON.parse(item);

            if (Date.now() > expiry) {
                this.removeItem(key);
                return defaultValue;
            }

            return value;
        } catch (error) {
            console.error('Storage getWithExpiry error:', error);
            return defaultValue;
        }
    }
}

// Create instance
export const storage = new SecureStorage();

// Session storage wrapper
export const sessionStorage = {
    setItem: (key, value) => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('SessionStorage setItem error:', error);
            return false;
        }
    },

    getItem: (key, defaultValue = null) => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('SessionStorage getItem error:', error);
            return defaultValue;
        }
    },

    removeItem: (key) => {
        try {
            window.sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('SessionStorage removeItem error:', error);
            return false;
        }
    },

    clear: () => {
        try {
            window.sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('SessionStorage clear error:', error);
            return false;
        }
    },
};
