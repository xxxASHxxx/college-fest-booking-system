import api from './api';

const adminService = {
    // === USER MANAGEMENT ===
    getAllUsers: async (page = 0, size = 20, sort = 'createdAt,desc') => {
        try {
            const response = await api.get(`/admin/users?page=${page}&size=${size}&sort=${sort}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch users.',
            };
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch user details.',
            };
        }
    },

    updateUserRole: async (userId, role) => {
        try {
            const response = await api.put(`/admin/users/${userId}/role`, { role });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update user role.',
            };
        }
    },

    suspendUser: async (userId, reason) => {
        try {
            const response = await api.put(`/admin/users/${userId}/suspend`, { reason });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to suspend user.',
            };
        }
    },

    // === BOOKING MANAGEMENT ===
    getAllBookings: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.page) params.append('page', filters.page);
            if (filters.size) params.append('size', filters.size);

            const response = await api.get(`/admin/bookings?${params.toString()}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch bookings.',
            };
        }
    },

    updateBookingStatus: async (bookingId, status, notes = '') => {
        try {
            const response = await api.put(`/admin/bookings/${bookingId}/status`, { status, notes });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update booking status.',
            };
        }
    },

    // === EVENT MANAGEMENT ===
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/admin/events', eventData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create event.',
            };
        }
    },

    updateEvent: async (eventId, eventData) => {
        try {
            const response = await api.put(`/admin/events/${eventId}`, eventData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update event.',
            };
        }
    },

    deleteEvent: async (eventId) => {
        try {
            const response = await api.delete(`/admin/events/${eventId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete event.',
            };
        }
    },

    uploadEventImage: async (eventId, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await api.post(`/admin/events/${eventId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to upload image.',
            };
        }
    },

    // === ANALYTICS ===
    getAnalytics: async (dateRange = {}) => {
        try {
            const params = new URLSearchParams();
            if (dateRange.startDate) params.append('startDate', dateRange.startDate);
            if (dateRange.endDate) params.append('endDate', dateRange.endDate);

            const response = await api.get(`/admin/analytics?${params.toString()}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch analytics.',
            };
        }
    },

    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch dashboard stats.',
            };
        }
    },

    getRevenueReport: async (period = 'month') => {
        try {
            const response = await api.get(`/admin/reports/revenue?period=${period}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch revenue report.',
            };
        }
    },

    exportBookings: async (format = 'csv', filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.status) params.append('status', filters.status);

            const response = await api.get(`/admin/export/bookings?format=${format}&${params.toString()}`, {
                responseType: 'blob',
            });

            // Trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bookings-export.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to export bookings.',
            };
        }
    },

    // Send bulk notifications
    sendBulkNotification: async (notificationData) => {
        try {
            const response = await api.post('/admin/notifications/bulk', notificationData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to send notifications.',
            };
        }
    },
};

export default adminService;
