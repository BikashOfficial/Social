const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db.js");
const userRoutes = require("./routes/user.route.js");
const postRoutes = require("./routes/post.route.js");
const path = require('path');
const multer = require('multer');
const messageRoutes = require('./routes/message.route');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Socket.IO connection handling
const connectedUsers = new Map();
const userTypingStatus = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user login
    socket.on('user_connected', (userId) => {
        console.log('User connected:', userId);
        connectedUsers.set(userId, socket.id);
        // Broadcast to all clients that user is online
        io.emit('user_status_change', { 
            userId, 
            status: 'online',
            lastSeen: new Date().toISOString()
        });
        
        // Send currently online users to the newly connected user
        const onlineUsers = Array.from(connectedUsers.keys());
        socket.emit('initial_online_users', onlineUsers);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        let disconnectedUserId;
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }

        if (disconnectedUserId) {
            console.log('User disconnected:', disconnectedUserId);
            connectedUsers.delete(disconnectedUserId);
            const lastSeen = new Date().toISOString();
            io.emit('user_status_change', { 
                userId: disconnectedUserId, 
                status: 'offline',
                lastSeen 
            });
        }
    });

    // Handle explicit user offline status
    socket.on('user_offline', ({ userId }) => {
        if (connectedUsers.has(userId)) {
            connectedUsers.delete(userId);
            const lastSeen = new Date().toISOString();
            io.emit('user_status_change', { 
                userId, 
                status: 'offline',
                lastSeen 
            });
        }
    });

    // Handle typing status
    socket.on('typing_start', ({ userId, receiverId, isTyping }) => {
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing_status', { userId, isTyping });
        }
        
        // Clear typing status after timeout
        if (userTypingStatus.has(userId)) {
            clearTimeout(userTypingStatus.get(userId));
        }
        
        if (isTyping) {
            userTypingStatus.set(userId, setTimeout(() => {
                const receiverSocketId = connectedUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('typing_status', { userId, isTyping: false });
                }
                userTypingStatus.delete(userId);
            }, 3000));
        }
    });

    // Handle new messages
    socket.on('new_message', (message) => {
        console.log('New message received:', message);
        console.log('Connected users:', Array.from(connectedUsers.entries()));
        
        const receiverSocketId = connectedUsers.get(message.receiverId);
        console.log('Receiver socket ID:', receiverSocketId);
        
        if (receiverSocketId) {
            // Send to receiver
            io.to(receiverSocketId).emit('receive_message', {
                ...message,
                createdAt: new Date().toISOString()
            });
            
            // Send confirmation back to sender
            socket.emit('message_sent', {
                ...message,
                createdAt: new Date().toISOString()
            });
        } else {
            // If receiver is not connected, still confirm to sender
            socket.emit('message_sent', {
                ...message,
                createdAt: new Date().toISOString()
            });
        }
    });

    // Handle message read status
    socket.on('message_read', ({ messageId, senderId }) => {
        console.log('Message read:', messageId, 'by sender:', senderId);
        const senderSocketId = connectedUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('message_read_status', { messageId });
        }
    });
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: [
    //   "http://localhost:5173", 
    //   "https://phrln8jh-5173.inc1.devtunnels.ms/", // Local development
    //   "https://socialapp-c4ef.onrender.com", // Add your frontend domain
      "https://social-bice-xi.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectToDb();

// Add this after other middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const profilesDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
}

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use('/api/messages', messageRoutes);

// Add this before your other error handlers
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export io instance
module.exports = { app, server, io };
