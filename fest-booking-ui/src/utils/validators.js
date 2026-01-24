import { REGEX_PATTERNS, ERROR_MESSAGES } from './constants';

// Email validation
export const isValidEmail = (email) => {
    return REGEX_PATTERNS.EMAIL.test(email);
};

// Phone validation
export const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return REGEX_PATTERNS.PHONE.test(cleaned);
};

// Password validation
export const isValidPassword = (password) => {
    return REGEX_PATTERNS.PASSWORD.test(password);
};

// UPI ID validation
export const isValidUPI = (upi) => {
    return REGEX_PATTERNS.UPI.test(upi);
};

// Card number validation (Luhn algorithm)
export const isValidCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!REGEX_PATTERNS.CARD_NUMBER.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// CVV validation
export const isValidCVV = (cvv) => {
    return REGEX_PATTERNS.CVV.test(cvv);
};

// Expiry date validation
export const isValidExpiryDate = (expiry) => {
    if (!REGEX_PATTERNS.EXPIRY_DATE.test(expiry)) {
        return false;
    }

    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

// Pincode validation
export const isValidPincode = (pincode) => {
    return REGEX_PATTERNS.PINCODE.test(pincode);
};

// URL validation
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

// File validation
export const isValidFile = (file, allowedTypes, maxSize) => {
    if (!file) return false;

    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return false;
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
        return false;
    }

    return true;
};

// Age validation (must be 18+)
export const isValidAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age >= 18;
};

// Form validation
export const validateForm = (values, rules) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const rule = rules[field];
        const value = values[field];

        // Required check
        if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
            errors[field] = rule.message || ERROR_MESSAGES.REQUIRED;
            return;
        }

        // Skip other validations if empty and not required
        if (!value) return;

        // Min length check
        if (rule.minLength && value.length < rule.minLength) {
            errors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
            return;
        }

        // Max length check
        if (rule.maxLength && value.length > rule.maxLength) {
            errors[field] = rule.message || `Maximum ${rule.maxLength} characters allowed`;
            return;
        }

        // Pattern check
        if (rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || 'Invalid format';
            return;
        }

        // Email check
        if (rule.email && !isValidEmail(value)) {
            errors[field] = rule.message || ERROR_MESSAGES.INVALID_EMAIL;
            return;
        }

        // Phone check
        if (rule.phone && !isValidPhone(value)) {
            errors[field] = rule.message || ERROR_MESSAGES.INVALID_PHONE;
            return;
        }

        // Password check
        if (rule.password && !isValidPassword(value)) {
            errors[field] = rule.message || ERROR_MESSAGES.INVALID_PASSWORD;
            return;
        }

        // Match check (e.g., password confirmation)
        if (rule.match && value !== values[rule.match]) {
            errors[field] = rule.message || ERROR_MESSAGES.PASSWORD_MISMATCH;
            return;
        }

        // Min value check
        if (rule.min !== undefined && Number(value) < rule.min) {
            errors[field] = rule.message || `Minimum value is ${rule.min}`;
            return;
        }

        // Max value check
        if (rule.max !== undefined && Number(value) > rule.max) {
            errors[field] = rule.message || `Maximum value is ${rule.max}`;
            return;
        }

        // Custom validator
        if (rule.validator && !rule.validator(value, values)) {
            errors[field] = rule.message || 'Invalid value';
            return;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
