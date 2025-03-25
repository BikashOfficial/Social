import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.handlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(userId) {
        if (this.socket) return;

        this.socket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true,
            query: { userId },
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            transports: ['polling', 'websocket'],
            extraHeaders: {
                'Origin': window.location.origin
            }
        });

        // Set up connection handlers
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.reconnectAttempts = 0;
            if (userId) {
                this.socket.emit('user_connected', userId);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.reconnectAttempts++;
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Message events
    sendMessage(message) {
        if (!this.socket) return;
        console.log('Sending message:', message);
        this.socket.emit('new_message', message);
    }

    onMessage(callback) {
        if (!this.socket) return;
        this.socket.on('receive_message', (message) => {
            console.log('Received message event:', message);
            callback(message);
        });
        this.handlers.set('receive_message', callback);
    }

    onMessageSent(callback) {
        if (!this.socket) return;
        this.socket.on('message_sent', (message) => {
            console.log('Message sent confirmation:', message);
            callback(message);
        });
        this.handlers.set('message_sent', callback);
    }

    // Typing events
    sendTyping(data) {
        if (!this.socket) return;
        this.socket.emit('typing_start', data);
    }

    onTyping(callback) {
        if (!this.socket) return;
        this.socket.on('typing_status', callback);
        this.handlers.set('typing_status', callback);
    }

    // User status events
    onUserStatus(callback) {
        if (!this.socket) return;
        this.socket.on('user_status_change', callback);
        this.handlers.set('user_status_change', callback);
    }

    onInitialOnlineUsers(callback) {
        if (!this.socket) return;
        this.socket.on('initial_online_users', callback);
        this.handlers.set('initial_online_users', callback);
    }

    // Message read status
    markMessageRead(messageId, senderId) {
        if (!this.socket) return;
        this.socket.emit('message_read', { messageId, senderId });
    }

    onMessageRead(callback) {
        if (!this.socket) return;
        this.socket.on('message_read_status', callback);
        this.handlers.set('message_read_status', callback);
    }

    // Friend request events
    onFriendRequest(callback) {
        if (!this.socket) return;
        this.socket.on('friend_request', callback);
        this.handlers.set('friend_request', callback);
    }

    // Clean up event listeners
    removeAllListeners() {
        if (!this.socket) return;
        this.handlers.forEach((handler, event) => {
            this.socket.off(event, handler);
        });
        this.handlers.clear();
    }

    // Connection status
    isConnected() {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService(); 