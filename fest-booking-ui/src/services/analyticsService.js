import { apiClient } from './api';

const analyticsService = {
    // Track page view
    trackPageView: async (page, metadata = {}) => {
        try {
            return await apiClient.post('/api/analytics/page-view', {
                page,
                timestamp: new Date().toISOString(),
                ...metadata,
            });
        } catch (error) {
            console.error('Failed to track page view:', error);
            return { success: false };
        }
    },

    // Track event
    trackEvent: async (eventName, properties = {}) => {
        try {
            return await apiClient.post('/api/analytics/event', {
                eventName,
                properties,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to track event:', error);
            return { success: false };
        }
    },

    // Track user action
    trackAction: async (action, details = {}) => {
        try {
            return await apiClient.post('/api/analytics/action', {
                action,
                details,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to track action:', error);
            return { success: false };
        }
    },

    // Track booking funnel
    trackBookingStep: async (step, eventId, metadata = {}) => {
        try {
            return await apiClient.post('/api/analytics/booking-funnel', {
                step,
                eventId,
                timestamp: new Date().toISOString(),
                ...metadata,
            });
        } catch (error) {
            console.error('Failed to track booking step:', error);
            return { success: false };
        }
    },

    // Get user analytics
    getUserAnalytics: async () => {
        try {
            return await apiClient.get('/api/analytics/user');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch analytics',
            };
        }
    },

    // Get event analytics
    getEventAnalytics: async (eventId) => {
        try {
            return await apiClient.get(`/api/analytics/event/${eventId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch event analytics',
            };
        }
    },
};

export default analyticsService;
