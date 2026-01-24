import analyticsService from '../services/analyticsService';

// Track page view
export const trackPageView = (pageName, metadata = {}) => {
    analyticsService.trackPageView(pageName, metadata);

    // Also track with Google Analytics if available
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href,
            page_path: window.location.pathname,
            ...metadata,
        });
    }
};

// Track event
export const trackEvent = (eventName, properties = {}) => {
    analyticsService.trackEvent(eventName, properties);

    // Also track with Google Analytics if available
    if (window.gtag) {
        window.gtag('event', eventName, properties);
    }
};

// Track button click
export const trackButtonClick = (buttonName, location = '') => {
    trackEvent('button_click', {
        button_name: buttonName,
        location,
    });
};

// Track form submission
export const trackFormSubmit = (formName, success = true) => {
    trackEvent('form_submit', {
        form_name: formName,
        success,
    });
};

// Track search
export const trackSearch = (query, resultsCount = 0) => {
    trackEvent('search', {
        search_term: query,
        results_count: resultsCount,
    });
};

// Track booking started
export const trackBookingStarted = (eventId, eventName) => {
    trackEvent('booking_started', {
        event_id: eventId,
        event_name: eventName,
    });
};

// Track booking completed
export const trackBookingCompleted = (bookingId, amount, eventId) => {
    trackEvent('booking_completed', {
        booking_id: bookingId,
        value: amount,
        event_id: eventId,
        currency: 'INR',
    });

    // E-commerce tracking
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: bookingId,
            value: amount,
            currency: 'INR',
        });
    }
};

// Track payment method selected
export const trackPaymentMethod = (method) => {
    trackEvent('payment_method_selected', {
        payment_method: method,
    });
};

// Track error
export const trackError = (errorType, errorMessage, context = {}) => {
    trackEvent('error', {
        error_type: errorType,
        error_message: errorMessage,
        ...context,
    });
};

// Track user signup
export const trackSignup = (method = 'email') => {
    trackEvent('sign_up', {
        method,
    });

    if (window.gtag) {
        window.gtag('event', 'sign_up', { method });
    }
};

// Track user login
export const trackLogin = (method = 'email') => {
    trackEvent('login', {
        method,
    });

    if (window.gtag) {
        window.gtag('event', 'login', { method });
    }
};

// Track logout
export const trackLogout = () => {
    trackEvent('logout');
};

// Track share
export const trackShare = (contentType, contentId, method = '') => {
    trackEvent('share', {
        content_type: contentType,
        content_id: contentId,
        method,
    });
};

// Track filter applied
export const trackFilterApplied = (filterType, filterValue) => {
    trackEvent('filter_applied', {
        filter_type: filterType,
        filter_value: filterValue,
    });
};

// Track sort applied
export const trackSortApplied = (sortBy, sortOrder) => {
    trackEvent('sort_applied', {
        sort_by: sortBy,
        sort_order: sortOrder,
    });
};
