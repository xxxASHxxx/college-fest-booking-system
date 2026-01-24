import api from './api';

const ticketService = {
    // Get ticket by ID
    getTicketById: async (ticketId) => {
        try {
            const response = await api.get(`/tickets/${ticketId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch ticket details.',
            };
        }
    },

    // Get tickets by booking ID
    getTicketsByBookingId: async (bookingId) => {
        try {
            const response = await api.get(`/tickets/booking/${bookingId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch tickets.',
            };
        }
    },

    // Get user tickets
    getUserTickets: async (userId, filter = 'all') => {
        try {
            const response = await api.get(`/tickets/user/${userId}?filter=${filter}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch user tickets.',
            };
        }
    },

    // Download ticket as PDF
    downloadTicket: async (ticketId) => {
        try {
            const response = await api.get(`/tickets/${ticketId}/download`, {
                responseType: 'blob',
            });

            // Create blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-${ticketId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to download ticket.',
            };
        }
    },

    // Validate ticket QR code
    validateTicket: async (qrCode) => {
        try {
            const response = await api.post('/tickets/validate', { qrCode });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Ticket validation failed.',
            };
        }
    },

    // Check-in ticket
    checkInTicket: async (ticketId) => {
        try {
            const response = await api.put(`/tickets/${ticketId}/check-in`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Check-in failed.',
            };
        }
    },

    // Share ticket
    shareTicket: async (ticketId, email) => {
        try {
            const response = await api.post(`/tickets/${ticketId}/share`, { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to share ticket.',
            };
        }
    },
};

export default ticketService;
