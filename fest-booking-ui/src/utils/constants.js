// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000; // 30 seconds

// WebSocket Configuration
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080';

// App Configuration
export const APP_NAME = 'FestBook';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'College Event Booking Platform';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'hh:mm A';
export const DATETIME_FORMAT = 'MMM DD, YYYY hh:mm A';
export const DATE_INPUT_FORMAT = 'YYYY-MM-DD';

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Payment Methods
export const PAYMENT_METHODS = {
    CARD: 'card',
    UPI: 'upi',
    NET_BANKING: 'netbanking',
    WALLET: 'wallet',
};

// Booking Status
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded',
};

// Ticket Status
export const TICKET_STATUS = {
    ACTIVE: 'active',
    USED: 'used',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
};

// User Roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    ORGANIZER: 'ORGANIZER',
};

// Event Categories
export const EVENT_CATEGORIES = [
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'dance', label: 'Dance', icon: '💃' },
    { value: 'drama', label: 'Drama', icon: '🎭' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'tech', label: 'Tech', icon: '💻' },
    { value: 'art', label: 'Art', icon: '🎨' },
    { value: 'cultural', label: 'Cultural', icon: '🎪' },
    { value: 'workshop', label: 'Workshop', icon: '🛠️' },
    { value: 'seminar', label: 'Seminar', icon: '📚' },
    { value: 'other', label: 'Other', icon: '📌' },
];

// Seat Types
export const SEAT_TYPES = {
    GENERAL: { id: 'general', label: 'General', multiplier: 1 },
    VIP: { id: 'vip', label: 'VIP', multiplier: 1.5 },
    PREMIUM: { id: 'premium', label: 'Premium', multiplier: 2 },
};

// Tax Rate
export const TAX_RATE = 0.18; // 18% GST

// Service Fee
export const SERVICE_FEE_RATE = 0.05; // 5%

// Currency
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

// Notification Types
export const NOTIFICATION_TYPES = {
    BOOKING: 'booking',
    PAYMENT: 'payment',
    EVENT: 'event',
    SYSTEM: 'system',
    PROMOTION: 'promotion',
};

// Toast Duration
export const TOAST_DURATION = {
    SHORT: 2000,
    NORMAL: 3000,
    LONG: 5000,
};

// Booking Timer
export const BOOKING_TIMER_DURATION = 900; // 15 minutes in seconds

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    THEME: 'theme',
    ACCENT_COLOR: 'accentColor',
    CART: 'cart',
    LANGUAGE: 'language',
};

// Regex Patterns
export const REGEX_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    PHONE: /^[6-9]\d{9}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    UPI: /^[\w.-]+@[\w.-]+$/,
    CARD_NUMBER: /^\d{13,19}$/,
    CVV: /^\d{3,4}$/,
    EXPIRY_DATE: /^(0[1-9]|1[0-2])\/\d{2}$/,
    PINCODE: /^\d{6}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid 10-digit phone number',
    INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
    PASSWORD_MISMATCH: 'Passwords do not match',
    INVALID_UPI: 'Please enter a valid UPI ID',
    INVALID_CARD: 'Please enter a valid card number',
    INVALID_CVV: 'Please enter a valid CVV',
    INVALID_EXPIRY: 'Please enter a valid expiry date (MM/YY)',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    BOOKING_CONFIRMED: 'Booking confirmed successfully!',
    PAYMENT_SUCCESS: 'Payment successful!',
    EMAIL_SENT: 'Email sent successfully',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    PROFILE: '/profile',
    EVENTS: '/events',
    EVENT_DETAILS: '/events/:id',
    BOOKING: '/booking/:id',
    MY_BOOKINGS: '/my-bookings',
    MY_TICKETS: '/my-tickets',
    ADMIN: '/admin',
    ADMIN_EVENTS: '/admin/events',
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_USERS: '/admin/users',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_REPORTS: '/admin/reports',
    NOT_FOUND: '*',
};

// Social Media Links
export const SOCIAL_LINKS = {
    FACEBOOK: 'https://facebook.com/festbook',
    TWITTER: 'https://twitter.com/festbook',
    INSTAGRAM: 'https://instagram.com/festbook',
    LINKEDIN: 'https://linkedin.com/company/festbook',
    YOUTUBE: 'https://youtube.com/festbook',
};

// Contact Information
export const CONTACT_INFO = {
    EMAIL: 'support@festbook.com',
    PHONE: '+91 1234567890',
    ADDRESS: '123 College Street, City, State - 123456',
};

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
    SHORT: 60000, // 1 minute
    MEDIUM: 300000, // 5 minutes
    LONG: 900000, // 15 minutes
    VERY_LONG: 3600000, // 1 hour
};

// Image Placeholder
export const IMAGE_PLACEHOLDER = '/images/placeholder.jpg';
export const EVENT_IMAGE_PLACEHOLDER = '/images/placeholder-event.jpg';
export const USER_AVATAR_PLACEHOLDER = '/images/avatar-placeholder.png';

// Breakpoints
export const BREAKPOINTS = {
    MOBILE: 640,
    TABLET: 768,
    LAPTOP: 1024,
    DESKTOP: 1280,
};
