// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (Indian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned);
};

// Password strength validation
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = {
        isValid: false,
        score: 0,
        feedback: [],
    };

    if (password.length < minLength) {
        strength.feedback.push(`Password must be at least ${minLength} characters long`);
    } else {
        strength.score += 1;
    }

    if (!hasUpperCase) {
        strength.feedback.push('Include at least one uppercase letter');
    } else {
        strength.score += 1;
    }

    if (!hasLowerCase) {
        strength.feedback.push('Include at least one lowercase letter');
    } else {
        strength.score += 1;
    }

    if (!hasNumber) {
        strength.feedback.push('Include at least one number');
    } else {
        strength.score += 1;
    }

    if (!hasSpecialChar) {
        strength.feedback.push('Include at least one special character');
    } else {
        strength.score += 1;
    }

    strength.isValid = strength.score >= 4;

    // Strength levels
    if (strength.score <= 2) {
        strength.level = 'weak';
    } else if (strength.score === 3 || strength.score === 4) {
        strength.level = 'medium';
    } else {
        strength.level = 'strong';
    }

    return strength;
};

// Name validation
export const isValidName = (name) => {
    if (!name || name.trim().length < 2) return false;
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};

// Age validation
export const isValidAge = (age) => {
    return age >= 10 && age <= 120;
};

// Date validation (future date)
export const isFutureDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
};

// URL validation
export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

// Promo code validation
export const isValidPromoCode = (code) => {
    if (!code || code.length < 4 || code.length > 20) return false;
    const promoRegex = /^[A-Z0-9]+$/;
    return promoRegex.test(code);
};

// Credit card validation (basic Luhn algorithm)
export const isValidCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);

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
    return /^\d{3,4}$/.test(cvv);
};

// Expiry date validation (MM/YY format)
export const isValidExpiryDate = (expiry) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split('/');
    const expiryDate = new Date(`20${year}`, month - 1);
    const now = new Date();

    return expiryDate > now;
};

// Form validation helper
export const validateForm = (fields, rules) => {
    const errors = {};

    Object.keys(rules).forEach((fieldName) => {
        const value = fields[fieldName];
        const fieldRules = rules[fieldName];

        if (fieldRules.required && (!value || value.trim() === '')) {
            errors[fieldName] = `${fieldName} is required`;
            return;
        }

        if (value && fieldRules.email && !isValidEmail(value)) {
            errors[fieldName] = 'Invalid email address';
        }

        if (value && fieldRules.phone && !isValidPhone(value)) {
            errors[fieldName] = 'Invalid phone number';
        }

        if (value && fieldRules.minLength && value.length < fieldRules.minLength) {
            errors[fieldName] = `Must be at least ${fieldRules.minLength} characters`;
        }

        if (value && fieldRules.maxLength && value.length > fieldRules.maxLength) {
            errors[fieldName] = `Must be at most ${fieldRules.maxLength} characters`;
        }

        if (value && fieldRules.matches && value !== fields[fieldRules.matches]) {
            errors[fieldName] = `${fieldName} does not match`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
