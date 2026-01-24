import { v4 as uuidv4 } from 'uuid';

// Generate unique booking ID
export const generateBookingId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `BKG-${timestamp}-${randomStr}`.toUpperCase();
};

// Generate unique ticket ID
export const generateTicketId = () => {
    return `TKT-${uuidv4().substring(0, 8)}`.toUpperCase();
};

// Calculate total amount with tax and fees
export const calculateTotal = (basePrice, quantity = 1, taxRate = 0.18, serviceFee = 50) => {
    const subtotal = basePrice * quantity;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + serviceFee;

    return {
        subtotal,
        tax,
        serviceFee,
        total,
        breakdown: {
            basePrice,
            quantity,
            taxRate: `${(taxRate * 100).toFixed(0)}%`,
        },
    };
};

// Apply discount
export const applyDiscount = (amount, discountPercent) => {
    const discount = (amount * discountPercent) / 100;
    const finalAmount = amount - discount;

    return {
        original: amount,
        discount,
        discountPercent,
        final: finalAmount,
    };
};

// Check if event is sold out
export const isSoldOut = (event) => {
    return event.availableSeats <= 0 || event.status === 'sold_out';
};

// Check if event is upcoming
export const isUpcoming = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    return date > now;
};

// Check if event is past
export const isPast = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    return date < now;
};

// Check if event is happening today
export const isToday = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);

    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

// Get days until event
export const getDaysUntilEvent = (eventDate) => {
    const now = new Date();
    const date = new Date(eventDate);
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// Debounce function
export const debounce = (func, wait) => {
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
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

// Scroll to top smoothly
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// Download file
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
};

// Get query parameters from URL
export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params) {
        result[key] = value;
    }

    return result;
};

// Build query string from object
export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
        }
    });

    return searchParams.toString();
};

// Generate QR code data
export const generateQRData = (ticketId, bookingId, eventId) => {
    return JSON.stringify({
        ticketId,
        bookingId,
        eventId,
        timestamp: new Date().toISOString(),
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

// Get file extension
export const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Random number generator
export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle array
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

// Sort array of objects
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        if (order === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        }
        return a[key] < b[key] ? 1 : -1;
    });
};

// Get browser info
export const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';

    if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
    } else if (userAgent.indexOf('Edge') > -1) {
        browserName = 'Edge';
    }

    return { browserName, userAgent };
};

// Check if mobile device
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

export default {
    generateBookingId,
    generateTicketId,
    calculateTotal,
    applyDiscount,
    isSoldOut,
    isUpcoming,
    isPast,
    isToday,
    getDaysUntilEvent,
    debounce,
    throttle,
    deepClone,
    isEmpty,
    scrollToTop,
    downloadFile,
    copyToClipboard,
    getQueryParams,
    buildQueryString,
    generateQRData,
    parseQRData,
    getFileExtension,
    getRandomNumber,
    shuffleArray,
    groupBy,
    sortBy,
    getBrowserInfo,
    isMobile,
};
