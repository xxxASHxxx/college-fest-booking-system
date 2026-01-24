import React, { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Add toast
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = uuidv4();
        const toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    // Remove toast
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Show success toast
    const showSuccess = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    // Show error toast
    const showError = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    // Show warning toast
    const showWarning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    // Show info toast
    const showInfo = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    // Clear all toasts
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value = {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAll,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
