import { CURRENCY_SYMBOL, DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants';

// Format currency
export const formatCurrency = (amount, currency = CURRENCY_SYMBOL) => {
    if (amount === null || amount === undefined) return `${currency}0`;

    return `${currency}${Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

// Format date
export const formatDate = (date, format = DATE_FORMAT) => {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const dayOfWeek = d.getDay();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    let formatted = format;

    // Replace tokens
    formatted = formatted.replace('YYYY', year);
    formatted = formatted.replace('YY', String(year).slice(-2));
    formatted = formatted.replace('MMMM', monthsFull[month]);
    formatted = formatted.replace('MMM', months[month]);
    formatted = formatted.replace('MM', String(month + 1).padStart(2, '0'));
    formatted = formatted.replace('M', month + 1);
    formatted = formatted.replace('DD', String(day).padStart(2, '0'));
    formatted = formatted.replace('D', day);
    formatted = formatted.replace('dddd', daysFull[dayOfWeek]);
    formatted = formatted.replace('ddd', days[dayOfWeek]);
    formatted = formatted.replace('HH', String(hours).padStart(2, '0'));
    formatted = formatted.replace('H', hours);
    formatted = formatted.replace('hh', String(hours % 12 || 12).padStart(2, '0'));
    formatted = formatted.replace('h', hours % 12 || 12);
    formatted = formatted.replace('mm', String(minutes).padStart(2, '0'));
    formatted = formatted.replace('m', minutes);
    formatted = formatted.replace('ss', String(seconds).padStart(2, '0'));
    formatted = formatted.replace('s', seconds);
    formatted = formatted.replace('A', hours >= 12 ? 'PM' : 'AM');
    formatted = formatted.replace('a', hours >= 12 ? 'pm' : 'am');

    return formatted;
};

// Format time
export const formatTime = (date, format = TIME_FORMAT) => {
    return formatDate(date, format);
};

// Format datetime
export const formatDateTime = (date, format = DATETIME_FORMAT) => {
    return formatDate(date, format);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }

    return phone;
};

// Format card number
export const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';

    const cleaned = cardNumber.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

    return formatted;
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`;
};

// Format number with commas
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return Number(number).toLocaleString('en-IN');
};

// Truncate text
export const truncateText = (text, maxLength = 50, suffix = '...') => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalize words
export const capitalizeWords = (text) => {
    if (!text) return '';
    return text.split(' ').map(capitalize).join(' ');
};

// Slugify text
export const slugify = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Format duration (seconds to HH:MM:SS)
export const formatDuration = (seconds) => {
    if (!seconds) return '00:00';

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Mask email (e.g., j***@example.com)
export const maskEmail = (email) => {
    if (!email) return '';

    const [username, domain] = email.split('@');
    if (!domain) return email;

    const maskedUsername = username[0] + '***' + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
};

// Mask phone (e.g., ****** 7890)
export const maskPhone = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) return phone;

    return '****** ' + cleaned.slice(-4);
};

// Mask card number (e.g., **** **** **** 1234)
export const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';

    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 13) return cardNumber;

    return '**** **** **** ' + cleaned.slice(-4);
};
