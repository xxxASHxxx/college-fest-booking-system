import api from './api';

const eventService = {
    // Get all events with optional filters
    getAllEvents: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.category) params.append('category', filters.category);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page);
            if (filters.size) params.append('size', filters.size);
            if (filters.sort) params.append('sort', filters.sort);

            const response = await api.get(`/events?${params.toString()}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch events.',
            };
        }
    },

    // Get event by ID
    getEventById: async (id) => {
        try {
            const response = await api.get(`/events/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch event details.',
            };
        }
    },

    // Get featured events
    getFeaturedEvents: async () => {
        try {
            const response = await api.get('/events/featured');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch featured events.',
            };
        }
    },

    // Search events
    searchEvents: async (query, page = 0, size = 12) => {
        try {
            const response = await api.get(`/events/search?query=${query}&page=${page}&size=${size}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Search failed.',
            };
        }
    },

    // Get events by category
    getEventsByCategory: async (category, page = 0, size = 12) => {
        try {
            const response = await api.get(`/events/category/${category}?page=${page}&size=${size}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch events by category.',
            };
        }
    },

    // Get available seats for event
    getAvailableSeats: async (eventId) => {
        try {
            const response = await api.get(`/events/${eventId}/available-seats`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch available seats.',
            };
        }
    },
};

export default eventService;
