import { apiClient } from './api';

const adminService = {
    // ========== EVENT MANAGEMENT ==========

    // Create event
    createEvent: async (eventData) => {
        try {
            return await apiClient.post('/api/admin/events', eventData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Event creation failed',
            };
        }
    },

    // Update event
    updateEvent: async (eventId, eventData) => {
        try {
            return await apiClient.put(`/api/admin/events/${eventId}`, eventData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Event update failed',
            };
        }
    },

    // Delete event
    deleteEvent: async (eventId) => {
        try {
            return await apiClient.delete(`/api/admin/events/${eventId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Event deletion failed',
            };
        }
    },

    // ========== BOOKING MANAGEMENT ==========

    // Get all bookings
    getAllBookings: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.eventId) params.append('eventId', filters.eventId);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 50);

            return await apiClient.get(`/api/admin/bookings?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch bookings',
            };
        }
    },

    // Update booking status
    updateBookingStatus: async (bookingId, status, notes = '') => {
        try {
            return await apiClient.patch(`/api/admin/bookings/${bookingId}/status`, {
                status,
                notes,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Status update failed',
            };
        }
    },

    // ========== USER MANAGEMENT ==========

    // Get all users
    getAllUsers: async (page = 0, size = 50) => {
        try {
            return await apiClient.get(`/api/admin/users?page=${page}&size=${size}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch users',
            };
        }
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        try {
            return await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Role update failed',
            };
        }
    },

    // Suspend user
    suspendUser: async (userId, reason = '') => {
        try {
            return await apiClient.post(`/api/admin/users/${userId}/suspend`, { reason });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'User suspension failed',
            };
        }
    },

    // Activate user
    activateUser: async (userId) => {
        try {
            return await apiClient.post(`/api/admin/users/${userId}/activate`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'User activation failed',
            };
        }
    },

    // ========== ANALYTICS ==========

    // Get analytics data
    getAnalytics: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.days) params.append('days', filters.days);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            return await apiClient.get(`/api/admin/analytics?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch analytics',
                data: {
                    totalRevenue: 0,
                    revenueGrowth: 0,
                    totalBookings: 0,
                    bookingsGrowth: 0,
                    totalUsers: 0,
                    usersGrowth: 0,
                    totalEvents: 0,
                    eventsGrowth: 0,
                    revenueData: [],
                    bookingsData: [],
                    topEvents: [],
                    categoryDistribution: [],
                    recentActivity: [],
                    avgBookingValue: 0,
                    conversionRate: 0,
                    activeUsersToday: 0,
                },
            };
        }
    },

    // Get dashboard stats
    getDashboardStats: async () => {
        try {
            return await apiClient.get('/api/admin/dashboard/stats');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch stats',
            };
        }
    },

    // ========== REPORTS ==========

    // Generate report
    generateReport: async (reportData) => {
        try {
            return await apiClient.post('/api/admin/reports/generate', reportData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Report generation failed',
            };
        }
    },

    // Export bookings
    exportBookings: async (format = 'csv', filters = {}) => {
        try {
            const params = new URLSearchParams({ format });

            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const result = await apiClient.get(
                `/api/admin/bookings/export?${params.toString()}`,
                { responseType: 'blob' }
            );

            if (result.success) {
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `bookings-export.${format}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Export failed',
            };
        }
    },

    // ========== PROMOTIONS ==========

    // Create promo code
    createPromoCode: async (promoData) => {
        try {
            return await apiClient.post('/api/admin/promo-codes', promoData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Promo code creation failed',
            };
        }
    },

    // Get all promo codes
    getAllPromoCodes: async () => {
        try {
            return await apiClient.get('/api/admin/promo-codes');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch promo codes',
            };
        }
    },

    // Delete promo code
    deletePromoCode: async (codeId) => {
        try {
            return await apiClient.delete(`/api/admin/promo-codes/${codeId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Promo code deletion failed',
            };
        }
    },
};

export default adminService;
