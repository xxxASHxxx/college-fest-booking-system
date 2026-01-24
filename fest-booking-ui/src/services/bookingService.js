import api from './api';

const bookingService = {
    // Create new booking
    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/bookings', bookingData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Booking failed. Please try again.',
            };
        }
    },

    // Get user bookings
    getUserBookings: async (userId, status = null, page = 0, size = 10) => {
        try {
            let url = `/bookings/user/${userId}?page=${page}&size=${size}`;
            if (status) {
                url += `&status=${status}`;
            }
            const response = await api.get(url);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch bookings.',
            };
        }
    },

    // Get booking by ID
    getBookingById: async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch booking details.',
            };
        }
    },

    // Cancel booking
    cancelBooking: async (bookingId, reason = '') => {
        try {
            const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Booking cancellation failed.',
            };
        }
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
        try {
            const response = await api.post('/bookings/verify-payment', paymentData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Payment verification failed.',
            };
        }
    },

    // Apply promo code
    applyPromoCode: async (code, bookingData) => {
        try {
            const response = await api.post('/bookings/apply-promo', { code, ...bookingData });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid promo code.',
            };
        }
    },

    // Get booking statistics
    getBookingStats: async () => {
        try {
            const response = await api.get('/bookings/stats');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch booking statistics.',
            };
        }
    },
};

export default bookingService;
