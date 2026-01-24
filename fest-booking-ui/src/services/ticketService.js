import { apiClient } from './api';

const ticketService = {
    // Get ticket by ID
    getTicketById: async (ticketId) => {
        try {
            return await apiClient.get(`/api/tickets/${ticketId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch ticket',
            };
        }
    },

    // Get tickets by booking ID
    getTicketsByBookingId: async (bookingId) => {
        try {
            return await apiClient.get(`/api/tickets/booking/${bookingId}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch tickets',
            };
        }
    },

    // Get user's tickets
    getUserTickets: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.eventId) params.append('eventId', filters.eventId);

            params.append('page', filters.page || 0);
            params.append('size', filters.size || 20);

            return await apiClient.get(`/api/tickets/my-tickets?${params.toString()}`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch tickets',
            };
        }
    },

    // Download ticket
    downloadTicket: async (ticketId) => {
        try {
            const result = await apiClient.get(`/api/tickets/${ticketId}/download`, {
                responseType: 'blob',
            });

            if (result.success) {
                // Create download link
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ticket-${ticketId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Download failed',
            };
        }
    },

    // Verify ticket QR code
    verifyTicketQR: async (qrData) => {
        try {
            return await apiClient.post('/api/tickets/verify-qr', { qrData });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Verification failed',
            };
        }
    },

    // Check-in ticket
    checkInTicket: async (ticketId) => {
        try {
            return await apiClient.post(`/api/tickets/${ticketId}/check-in`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Check-in failed',
            };
        }
    },

    // Transfer ticket
    transferTicket: async (ticketId, recipientEmail) => {
        try {
            return await apiClient.post(`/api/tickets/${ticketId}/transfer`, {
                recipientEmail,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Transfer failed',
            };
        }
    },

    // Resend ticket email
    resendTicketEmail: async (ticketId) => {
        try {
            return await apiClient.post(`/api/tickets/${ticketId}/resend-email`);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to resend email',
            };
        }
    },
};

export default ticketService;
