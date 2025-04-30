// utils/socketService.js
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

// Initialize Socket.IO
const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });
  
  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Join user's own room for receiving messages
    socket.join(socket.user._id.toString());
    
    // Update user's online status
    updateUserStatus(socket.user._id, true);
    
    // Handle events
    setupSocketEvents(socket);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      updateUserStatus(socket.user._id, false);
    });
  });
  
  return io;
};

// Setup socket event handlers
const setupSocketEvents = (socket) => {
  // Join a conversation room
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`${socket.user.name} joined conversation: ${conversationId}`);
  });
  
  // Leave a conversation room
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`${socket.user.name} left conversation: ${conversationId}`);
  });
  
  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    
    // Broadcast typing status to conversation room except sender
    socket.to(`conversation:${conversationId}`).emit('user-typing', {
      userId: socket.user._id,
      userName: socket.user.name,
      isTyping
    });
  });
  
  // Mark messages as read
  socket.on('mark-read', async (data) => {
    const { conversationId } = data;
    
    // Broadcast read status to conversation room except sender
    socket.to(`conversation:${conversationId}`).emit('messages-read', {
      userId: socket.user._id,
      conversationId
    });
  });
};

// Update user's online status
const updateUserStatus = async (userId, isOnline) => {
  try {
    // Here you could update the user's status in the database
    // For simplicity, we're just broadcasting the status change
    io.emit('user-status-change', {
      userId,
      isOnline
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

// Send new message notification
const notifyNewMessage = (message, conversation) => {
  if (!io) return;
  
  // Emit to conversation room
  io.to(`conversation:${conversation._id}`).emit('new-message', {
    message,
    conversation
  });
  
  // Also emit to each participant's personal room
  conversation.participants.forEach(participantId => {
    if (participantId.toString() !== message.sender.toString()) {
      io.to(participantId.toString()).emit('message-notification', {
        message,
        conversation
      });
    }
  });
};

// Notify about read messages
const notifyMessagesRead = (userId, conversationId) => {
  if (!io) return;
  
  io.to(`conversation:${conversationId}`).emit('messages-read', {
    userId,
    conversationId
  });
};

module.exports = {
  initSocket,
  notifyNewMessage,
  notifyMessagesRead,
  getIO: () => io
};

// server.js modification
const express = require('express');
const http = require('http');
const socketService = require('./utils/socketService');

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
 io = socketService.initSocket(server);

// Export io instance for use in controllers
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});