import React, { createContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import websocketService from '../services/websocketService';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch notifications on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            fetchUnreadCount();

            // Subscribe to real-time notifications
            websocketService.subscribeToNotifications(handleNewNotification);
        }

        return () => {
            // Cleanup
        };
    }, [isAuthenticated]);

    // Fetch notifications
    const fetchNotifications = useCallback(async (filters = {}) => {
        setLoading(true);
        try {
            const result = await notificationService.getNotifications(filters);
            if (result.success) {
                setNotifications(result.data.content || result.data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const result = await notificationService.getUnreadCount();
            if (result.success) {
                setUnreadCount(result.data.count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    // Handle new notification from WebSocket
    const handleNewNotification = useCallback((notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/logo192.png',
            });
        }
    }, []);

    // Mark as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            const result = await notificationService.markAsRead(notificationId);
            if (result.success) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, read: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            const result = await notificationService.markAllAsRead();
            if (result.success) {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const result = await notificationService.deleteNotification(notificationId);
            if (result.success) {
                setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, []);

    // Clear all notifications
    const clearAll = useCallback(async () => {
        try {
            const result = await notificationService.clearAll();
            if (result.success) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    }, []);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    }, []);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPermission,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
