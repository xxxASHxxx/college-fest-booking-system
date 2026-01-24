import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    // Connect to WebSocket server
    connect(token) {
        if (this.socket) {
            return;
        }

        this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8080', {
            auth: {
                token,
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    // Disconnect from WebSocket server
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    // Subscribe to event
    on(event, callback) {
        if (!this.socket) {
            console.error('WebSocket not connected');
            return;
        }

        this.socket.on(event, callback);

        // Store listener for cleanup
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    // Unsubscribe from event
    off(event, callback) {
        if (!this.socket) {
            return;
        }

        this.socket.off(event, callback);

        // Remove from listeners
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // Emit event
    emit(event, data) {
        if (!this.socket) {
            console.error('WebSocket not connected');
            return;
        }

        this.socket.emit(event, data);
    }

    // Join room
    joinRoom(roomId) {
        this.emit('join-room', { roomId });
    }

    // Leave room
    leaveRoom(roomId) {
        this.emit('leave-room', { roomId });
    }

    // Subscribe to notifications
    subscribeToNotifications(callback) {
        this.on('notification', callback);
    }

    // Subscribe to booking updates
    subscribeToBookingUpdates(bookingId, callback) {
        this.joinRoom(`booking-${bookingId}`);
        this.on('booking-update', callback);
    }

    // Subscribe to seat availability updates
    subscribeToSeatUpdates(eventId, callback) {
        this.joinRoom(`event-${eventId}`);
        this.on('seat-update', callback);
    }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
