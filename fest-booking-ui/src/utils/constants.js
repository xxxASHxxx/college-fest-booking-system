// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    EVENTS: {
        BASE: '/events',
        FEATURED: '/events/featured',
        SEARCH: '/events/search',
        CATEGORY: '/events/category',
        AVAILABLE_SEATS: '/events/:id/available-seats',
    },
    BOOKINGS: {
        BASE: '/bookings',
        USER: '/bookings/user/:userId',
        CANCEL: '/bookings/:id/cancel',
        VERIFY_PAYMENT: '/bookings/verify-payment',
        APPLY_PROMO: '/bookings/apply-promo',
        STATS: '/bookings/stats',
    },
    TICKETS: {
        BASE: '/tickets',
        BOOKING: '/tickets/booking/:bookingId',
        USER: '/tickets/user/:userId',
        DOWNLOAD: '/tickets/:id/download',
        VALIDATE: '/tickets/validate',
        CHECK_IN: '/tickets/:id/check-in',
        SHARE: '/tickets/:id/share',
    },
    ADMIN: {
        USERS: '/admin/users',
        BOOKINGS: '/admin/bookings',
        EVENTS: '/admin/events',
        ANALYTICS: '/admin/analytics',
        DASHBOARD: '/admin/dashboard/stats',
        REPORTS: '/admin/reports',
        EXPORT: '/admin/export',
        NOTIFICATIONS: '/admin/notifications/bulk',
    },
};

// Event categories
export const EVENT_CATEGORIES = [
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'dance', label: 'Dance', icon: '💃' },
    { value: 'drama', label: 'Drama', icon: '🎭' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'tech', label: 'Tech', icon: '💻' },
    { value: 'art', label: 'Art', icon: '🎨' },
    { value: 'comedy', label: 'Comedy', icon: '😂' },
    { value: 'workshop', label: 'Workshop', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '🎪' },
];

// Booking statuses
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded',
    FAILED: 'failed',
};

// Payment methods
export const PAYMENT_METHODS = {
    RAZORPAY: 'razorpay',
    STRIPE: 'stripe',
    UPI: 'upi',
    CARD: 'card',
    NET_BANKING: 'net_banking',
    WALLET: 'wallet',
};

// User roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ORGANIZER: 'ORGANIZER',
};

// Ticket status
export const TICKET_STATUS = {
    ACTIVE: 'active',
    USED: 'used',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
};

// Seat types
export const SEAT_TYPES = {
    GENERAL: 'general',
    VIP: 'vip',
    PREMIUM: 'premium',
    STUDENT: 'student',
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'DD MMM YYYY',
    API: 'YYYY-MM-DD',
    FULL: 'DD MMM YYYY, hh:mm A',
    TIME: 'hh:mm A',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 12,
    MAX_SIZE: 100,
};

// Image placeholders
export const PLACEHOLDER_IMAGES = {
    EVENT: '/images/placeholder-event.jpg',
    USER: '/images/placeholder-user.png',
    CATEGORY: '/images/placeholder-category.jpg',
};

// Booking timer (in minutes)
export const BOOKING_TIMER = 15;

// Toast positions
export const TOAST_POSITIONS = {
    TOP_RIGHT: 'top-right',
    TOP_CENTER: 'top-center',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_LEFT: 'bottom-left',
};

// Social links
export const SOCIAL_LINKS = {
    FACEBOOK: 'https://facebook.com',
    TWITTER: 'https://twitter.com',
    INSTAGRAM: 'https://instagram.com',
    LINKEDIN: 'https://linkedin.com',
    YOUTUBE: 'https://youtube.com',
};

// Contact info
export const CONTACT_INFO = {
    EMAIL: 'support@collegefest.com',
    PHONE: '+91 98765 43210',
    ADDRESS: 'SRM Institute of Technology, Chengalpattu, Tamil Nadu, India',
};

// Regex patterns
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[6-9]\d{9}$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    ALPHA_ONLY: /^[a-zA-Z\s]+$/,
    NUMERIC_ONLY: /^\d+$/,
};

// File upload limits
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

// Z-index layers
export const Z_INDEX = {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
};

export default {
    API_ENDPOINTS,
    EVENT_CATEGORIES,
    BOOKING_STATUS,
    PAYMENT_METHODS,
    USER_ROLES,
    TICKET_STATUS,
    SEAT_TYPES,
    DATE_FORMATS,
    PAGINATION,
    PLACEHOLDER_IMAGES,
    BOOKING_TIMER,
    TOAST_POSITIONS,
    SOCIAL_LINKS,
    CONTACT_INFO,
    REGEX_PATTERNS,
    FILE_UPLOAD,
    ANIMATION_DURATION,
    BREAKPOINTS,
    Z_INDEX,
};
