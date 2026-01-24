import { apiClient } from './api';

const paymentService = {
    // Initialize payment
    initializePayment: async (paymentData) => {
        try {
            return await apiClient.post('/api/payments/initialize', paymentData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Payment initialization failed',
            };
        }
    },

    // Process payment
    processPayment: async (paymentDetails) => {
        try {
            return await apiClient.post('/api/payments/process', paymentDetails);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Payment processing failed',
            };
        }
    },

    // Verify payment
    verifyPayment: async (paymentId, signature) => {
        try {
            return await apiClient.post('/api/payments/verify', {
                paymentId,
                signature,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Payment verification failed',
            };
        }
    },

    // Get payment by ID
    getPaymentById: async (paymentId) => {
        try {
            return await apiClient.get(`/api/payments/${paymentId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch payment',
            };
        }
    },

    // Get payment history
    getPaymentHistory: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 20);

            return await apiClient.get(`/api/payments/history?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch payment history',
            };
        }
    },

    // Request refund
    requestRefund: async (paymentId, reason = '') => {
        try {
            return await apiClient.post(`/api/payments/${paymentId}/refund`, { reason });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Refund request failed',
            };
        }
    },

    // Get refund status
    getRefundStatus: async (refundId) => {
        try {
            return await apiClient.get(`/api/payments/refunds/${refundId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch refund status',
            };
        }
    },

    // Razorpay Integration
    razorpay: {
        createOrder: async (amount, currency = 'INR', receipt) => {
            try {
                return await apiClient.post('/api/payments/razorpay/create-order', {
                    amount: amount * 100, // Convert to paise
                    currency,
                    receipt,
                });
            } catch (error) {
                return {
                    success: false,
                    error: error.message || 'Order creation failed',
                };
            }
        },

        verifySignature: async (orderId, paymentId, signature) => {
            try {
                return await apiClient.post('/api/payments/razorpay/verify', {
                    orderId,
                    paymentId,
                    signature,
                });
            } catch (error) {
                return {
                    success: false,
                    error: error.message || 'Signature verification failed',
                };
            }
        },
    },

    // Stripe Integration
    stripe: {
        createPaymentIntent: async (amount, currency = 'inr') => {
            try {
                return await apiClient.post('/api/payments/stripe/create-intent', {
                    amount: amount * 100, // Convert to smallest currency unit
                    currency,
                });
            } catch (error) {
                return {
                    success: false,
                    error: error.message || 'Payment intent creation failed',
                };
            }
        },

        confirmPayment: async (paymentIntentId) => {
            try {
                return await apiClient.post('/api/payments/stripe/confirm', {
                    paymentIntentId,
                });
            } catch (error) {
                return {
                    success: false,
                    error: error.message || 'Payment confirmation failed',
                };
            }
        },
    },

    // Save payment method
    savePaymentMethod: async (methodData) => {
        try {
            return await apiClient.post('/api/payments/methods', methodData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to save payment method',
            };
        }
    },

    // Get saved payment methods
    getSavedMethods: async () => {
        try {
            return await apiClient.get('/api/payments/methods');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch payment methods',
            };
        }
    },

    // Delete payment method
    deletePaymentMethod: async (methodId) => {
        try {
            return await apiClient.delete(`/api/payments/methods/${methodId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to delete payment method',
            };
        }
    },
};

export default paymentService;
