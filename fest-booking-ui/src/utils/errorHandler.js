import { ERROR_MESSAGES } from './constants';

// Error handler class
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

// Network error
export class NetworkError extends AppError {
    constructor(message = ERROR_MESSAGES.NETWORK_ERROR) {
        super(message, 0, true);
        this.name = 'NetworkError';
    }
}

// Authentication error
export class AuthenticationError extends AppError {
    constructor(message = ERROR_MESSAGES.SESSION_EXPIRED) {
        super(message, 401, true);
        this.name = 'AuthenticationError';
    }
}

// Validation error
export class ValidationError extends AppError {
    constructor(message, errors = {}) {
        super(message, 400, true);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

// Not found error
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, true);
        this.name = 'NotFoundError';
    }
}

// Server error
export class ServerError extends AppError {
    constructor(message = ERROR_MESSAGES.SERVER_ERROR) {
        super(message, 500, false);
        this.name = 'ServerError';
    }
}

// Handle API error
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return new ValidationError(data.message || 'Validation failed', data.errors);
            case 401:
                return new AuthenticationError(data.message);
            case 404:
                return new NotFoundError(data.message);
            case 500:
            case 502:
            case 503:
                return new ServerError(data.message);
            default:
                return new AppError(data.message || 'An error occurred', status);
        }
    } else if (error.request) {
        // Request made but no response
        return new NetworkError();
    } else {
        // Error in request setup
        return new AppError(error.message);
    }
};

// Log error
export const logError = (error, context = {}) => {
    console.error('Error:', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp || new Date().toISOString(),
        stack: error.stack,
        context,
    });

    // Send to error tracking service (e.g., Sentry)
    if (window.Sentry) {
        window.Sentry.captureException(error, { extra: context });
    }
};

// Handle async errors
export const asyncHandler = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const handledError = handleApiError(error);
            logError(handledError, { function: fn.name, args });
            throw handledError;
        }
    };
};

// Global error handler
export const setupGlobalErrorHandler = () => {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        logError(event.reason);
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        logError(event.error);
    });
};
