import { io } from 'socket.io-client';
import { getTokenInfo } from '../utils/debug';

class SocketService {
    constructor() {
        this.socket = null;
        this.handlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.connectionInProgress = false;
    }

    connect(userId) {
        if (this.socket || this.connectionInProgress) return;
        
        this.connectionInProgress = true;
        console.log('Attempting socket connection for user:', userId);

        const token = localStorage.getItem('token');
        const tokenInfo = getTokenInfo();
        
        // Build the connection options
        const connectionOptions = {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            query: { userId },
            auth: {
                token: token
            },
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true,
            extraHeaders: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Origin': window.location.origin
            }
        };
        
        console.log('Socket connecting with options:', {...connectionOptions, auth: { token: token ? '(token present)' : '(no token)' }});

        // Create the socket connection
        this.socket = io(import.meta.env.VITE_BASE_URL, connectionOptions);

        // Set up connection handlers
        this.socket.on('connect', () => {
            console.log('Socket connected successfully');
            this.reconnectAttempts = 0;
            this.connectionInProgress = false;
            
            if (userId) {
                this.socket.emit('user_connected', userId);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            this.reconnectAttempts++;
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max socket reconnection attempts reached');
                this.connectionInProgress = false;
                this.disconnect();
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.connectionInProgress = false;
            
            // If the server closed the connection, try reconnecting
            if (reason === 'io server disconnect') {
                setTimeout(() => {
                    if (userId) {
                        this.connect(userId);
                    }
                }, 5000);
            }
        });
        
        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connectionInProgress = false;
            console.log('Socket disconnected manually');
        }
    }

    // Check if socket is connected
    isConnected() {
        return this.socket?.connected || false;
    }

    // Reconnect with new userId (for example after login)
    reconnect(userId) {
        this.disconnect();
        setTimeout(() => {
            this.connect(userId);
        }, 500);
    }

    // Message events
    sendMessage(message) {
        if (!this.socket || !this.socket.connected) {
            console.warn('Cannot send message: socket not connected');
            return false;
        }
        console.log('Sending message:', message);
        this.socket.emit('new_message', message);
        return true;
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
}

export const socketService = new SocketService(); 