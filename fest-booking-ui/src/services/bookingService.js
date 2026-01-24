import { apiClient } from './api';

const bookingService = {
    // Create new booking
    createBooking: async (bookingData) => {
        try {
            return await apiClient.post('/api/bookings', bookingData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Booking creation failed',
            };
        }
    },

    // Get booking by ID
    getBookingById: async (bookingId) => {
        try {
            return await apiClient.get(`/api/bookings/${bookingId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch booking',
            };
        }
    },

    // Get user bookings
    getUserBookings: async (userId, filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 20);

            return await apiClient.get(`/api/bookings/user/${userId}?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch bookings',
            };
        }
    },

    // Get current user's bookings
    getMyBookings: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.page !== undefined) params.append('page', filters.page);
            if (filters.size !== undefined) params.append('size', filters.size);

            return await apiClient.get(`/api/bookings/my-bookings?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch bookings',
            };
        }
    },

    // Cancel booking
    cancelBooking: async (bookingId, reason = '') => {
        try {
            return await apiClient.post(`/api/bookings/${bookingId}/cancel`, { reason });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Booking cancellation failed',
            };
        }
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
        try {
            return await apiClient.post('/api/bookings/verify-payment', paymentData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Payment verification failed',
            };
        }
    },

    // Apply promo code
    applyPromoCode: async (code, bookingData) => {
        try {
            return await apiClient.post('/api/bookings/apply-promo', {
                promoCode: code,
                ...bookingData,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Invalid promo code',
            };
        }
    },

    // Hold seats temporarily (during booking process)
    holdSeats: async (eventId, quantity, seatType) => {
        try {
            return await apiClient.post('/api/bookings/hold-seats', {
                eventId,
                quantity,
                seatType,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to hold seats',
            };
        }
    },

    // Release held seats
    releaseSeats: async (holdId) => {
        try {
            return await apiClient.post(`/api/bookings/release-seats/${holdId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to release seats',
            };
        }
    },

    // Get booking statistics
    getBookingStats: async () => {
        try {
            return await apiClient.get('/api/bookings/stats');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch statistics',
            };
        }
    },

    // Send booking confirmation email
    sendConfirmationEmail: async (bookingId) => {
        try {
            return await apiClient.post(`/api/bookings/${bookingId}/send-confirmation`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to send email',
            };
        }
    },
};

export default bookingService;
