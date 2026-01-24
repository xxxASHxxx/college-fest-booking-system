import { apiClient } from './api';

const eventService = {
    // Get all events with filters and pagination
    getAllEvents: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 20);

            return await apiClient.get(`/api/events?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch events',
            };
        }
    },

    // Get event by ID
    getEventById: async (eventId) => {
        try {
            return await apiClient.get(`/api/events/${eventId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch event',
            };
        }
    },

    // Get featured events
    getFeaturedEvents: async () => {
        try {
            return await apiClient.get('/api/events/featured');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch featured events',
            };
        }
    },

    // Get upcoming events
    getUpcomingEvents: async (limit = 10) => {
        try {
            return await apiClient.get(`/api/events/upcoming?limit=${limit}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch upcoming events',
            };
        }
    },

    // Get popular events
    getPopularEvents: async (limit = 10) => {
        try {
            return await apiClient.get(`/api/events/popular?limit=${limit}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch popular events',
            };
        }
    },

    // Search events
    searchEvents: async (query, filters = {}) => {
        try {
            const params = new URLSearchParams({ q: query });

            if (filters.category) params.append('category', filters.category);
            if (filters.page) params.append('page', filters.page);
            if (filters.size) params.append('size', filters.size);

            return await apiClient.get(`/api/events/search?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Search failed',
            };
        }
    },

    // Get events by category
    getEventsByCategory: async (category, page = 0, size = 20) => {
        try {
            return await apiClient.get(`/api/events/category/${category}?page=${page}&size=${size}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch events',
            };
        }
    },

    // Get event categories
    getCategories: async () => {
        try {
            return await apiClient.get('/api/events/categories');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch categories',
            };
        }
    },

    // Check seat availability
    checkAvailability: async (eventId, quantity = 1, seatType = 'general') => {
        try {
            return await apiClient.post(`/api/events/${eventId}/check-availability`, {
                quantity,
                seatType,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to check availability',
            };
        }
    },

    // Get event reviews
    getEventReviews: async (eventId, page = 0, size = 10) => {
        try {
            return await apiClient.get(`/api/events/${eventId}/reviews?page=${page}&size=${size}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch reviews',
            };
        }
    },

    // Add event review
    addReview: async (eventId, reviewData) => {
        try {
            return await apiClient.post(`/api/events/${eventId}/reviews`, reviewData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to add review',
            };
        }
    },

    // Get similar events
    getSimilarEvents: async (eventId, limit = 5) => {
        try {
            return await apiClient.get(`/api/events/${eventId}/similar?limit=${limit}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch similar events',
            };
        }
    },
};

export default eventService;
