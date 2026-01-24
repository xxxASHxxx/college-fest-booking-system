import { apiClient } from './api';

const notificationService = {
    // Get user notifications
    getNotifications: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.read !== undefined) params.append('read', filters.read);
            if (filters.type) params.append('type', filters.type);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 20);

            return await apiClient.get(`/api/notifications?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch notifications',
            };
        }
    },

    // Get unread count
    getUnreadCount: async () => {
        try {
            return await apiClient.get('/api/notifications/unread-count');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch count',
            };
        }
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            return await apiClient.patch(`/api/notifications/${notificationId}/read`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to mark as read',
            };
        }
    },

    // Mark all as read
    markAllAsRead: async () => {
        try {
            return await apiClient.patch('/api/notifications/mark-all-read');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to mark all as read',
            };
        }
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        try {
            return await apiClient.delete(`/api/notifications/${notificationId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to delete notification',
            };
        }
    },

    // Clear all notifications
    clearAll: async () => {
        try {
            return await apiClient.delete('/api/notifications/clear-all');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to clear notifications',
            };
        }
    },

    // Get notification preferences
    getPreferences: async () => {
        try {
            return await apiClient.get('/api/notifications/preferences');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch preferences',
            };
        }
    },

    // Update notification preferences
    updatePreferences: async (preferences) => {
        try {
            return await apiClient.put('/api/notifications/preferences', preferences);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to update preferences',
            };
        }
    },

    // Send notification (admin only)
    sendNotification: async (notificationData) => {
        try {
            return await apiClient.post('/api/notifications/send', notificationData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to send notification',
            };
        }
    },

    // Subscribe to push notifications
    subscribePush: async (subscription) => {
        try {
            return await apiClient.post('/api/notifications/push/subscribe', subscription);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to subscribe',
            };
        }
    },

    // Unsubscribe from push notifications
    unsubscribePush: async () => {
        try {
            return await apiClient.post('/api/notifications/push/unsubscribe');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to unsubscribe',
            };
        }
    },
};

export default notificationService;
