// src/services/socketService.js
import { io } from 'socket.io-client';
import { getCurrentUser } from '../api/auth';

let socket = null;

// Initialize socket connection
export const initializeSocket = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Create socket instance
  socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001', {
    auth: {
      token
    }
  });
  
  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });
  
  return socket;
};

// Get socket instance (initialize if not already)
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Close socket connection
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join a conversation room
export const joinConversation = (conversationId) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('join-conversation', conversationId);
  }
};

// Leave a conversation room
export const leaveConversation = (conversationId) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('leave-conversation', conversationId);
  }
};

// Send typing indicator
export const sendTypingStatus = (conversationId, isTyping) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('typing', { conversationId, isTyping });
  }
};

// Mark messages as read
export const markMessagesAsRead = (conversationId) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('mark-read', { conversationId });
  }
};

// Listen for new messages
export const onNewMessage = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('new-message', callback);
  }
  return () => {
    if (socket) {
      socket.off('new-message', callback);
    }
  };
};

// Listen for message notifications
export const onMessageNotification = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('message-notification', callback);
  }
  return () => {
    if (socket) {
      socket.off('message-notification', callback);
    }
  };
};

// Listen for typing indicators
export const onUserTyping = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('user-typing', callback);
  }
  return () => {
    if (socket) {
      socket.off('user-typing', callback);
    }
  };
};

// Listen for read receipts
export const onMessagesRead = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('messages-read', callback);
  }
  return () => {
    if (socket) {
      socket.off('messages-read', callback);
    }
  };
};

// Listen for user status changes
export const onUserStatusChange = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('user-status-change', callback);
  }
  return () => {
    if (socket) {
      socket.off('user-status-change', callback);
    }
  };
};

export default {
  initializeSocket,
  getSocket,
  closeSocket,
  joinConversation,
  leaveConversation,
  sendTypingStatus,
  markMessagesAsRead,
  onNewMessage,
  onMessageNotification,
  onUserTyping,
  onMessagesRead,
  onUserStatusChange
};