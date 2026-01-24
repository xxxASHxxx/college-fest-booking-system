import { TAX_RATE, SERVICE_FEE_RATE, SEAT_TYPES, BOOKING_TIMER_DURATION } from './constants';

// Set auth token
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Get auth token
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Clear auth token
export const clearAuthToken = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Calculate total price with tax and fees
export const calculateTotal = (basePrice, quantity = 1) => {
    const subtotal = basePrice * quantity;
    const tax = subtotal * TAX_RATE;
    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const total = subtotal + tax + serviceFee;

    return {
        subtotal,
        tax,
        serviceFee,
        total,
        breakdown: {
            basePrice,
            quantity,
            taxRate: `${TAX_RATE * 100}%`,
            serviceFeeRate: `${SERVICE_FEE_RATE * 100}%`,
        },
    };
};

// Get seat price multiplier
export const getSeatPriceMultiplier = (seatType) => {
    return SEAT_TYPES[seatType.toUpperCase()]?.multiplier || 1;
};

// Check if event is upcoming
export const isUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
};

// Check if event is past
export const isPast = (eventDate) => {
    return new Date(eventDate) < new Date();
};

// Check if event is today
export const isToday = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);

    return (
        event.getDate() === today.getDate() &&
        event.getMonth() === today.getMonth() &&
        event.getFullYear() === today.getFullYear()
    );
};

// Get days until event
export const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// Check if event is sold out
export const isSoldOut = (event) => {
    return event.availableSeats <= 0;
};

// Generate booking ID
export const generateBookingId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `BK${timestamp}${random}`.toUpperCase();
};

// Generate ticket ID
export const generateTicketId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `TK${timestamp}${random}`.toUpperCase();
};

// Generate QR code data
export const generateQRData = (ticketId, bookingId, eventId) => {
    return JSON.stringify({
        ticketId,
        bookingId,
        eventId,
        timestamp: Date.now(),
    });
};

// Parse QR code data
export const parseQRData = (qrString) => {
    try {
        return JSON.parse(qrString);
    } catch (error) {
        return null;
    }
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// Remove duplicates from array
export const unique = (array, key) => {
    if (!key) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
};

// Chunk array
export const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

// Debounce function
export const debounce = (func, wait = 300) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
export const throttle = (func, limit = 300) => {
    let inThrottle;

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Download file
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
};

// Scroll to element
export const scrollToElement = (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
};

// Scroll to top
export const scrollToTop = (smooth = true) => {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
    });
};

// Get query params
export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params) {
        result[key] = value;
    }

    return result;
};

// Set query params
export const setQueryParams = (params) => {
    const searchParams = new URLSearchParams(params);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
};

// Generate random color
export const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Sleep/delay function
export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
export const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        await sleep(delay);
        return retry(fn, retries - 1, delay * 2);
    }
};

// Check if object is empty
export const isEmpty = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Merge objects deeply
export const mergeDeep = (target, source) => {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
};

// Check if value is object
const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

// Generate random string
export const generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Get contrast color (for text on colored background)
export const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
};
