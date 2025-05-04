// routes/messageRoutes.js - Fixed version with proper route handlers
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// We'll handle all message-related routes in one place
// Conversation routes
router.get('/conversations', messageController.getConversations);
router.get('/conversations/:id', messageController.getConversation);
router.post('/conversations', messageController.createConversation);
router.put('/conversations/:id/archive', messageController.archiveConversation);

// Message routes
router.get('/messages/:conversationId', messageController.getMessages);
router.post('/messages', messageController.sendMessage);

// Make sure these controller functions exist before adding the routes
if (messageController.updateMessage) {
  router.put('/messages/:id', messageController.updateMessage);
} else {
  console.error('Warning: messageController.updateMessage is not defined');
}

if (messageController.deleteMessage) {
  router.delete('/messages/:id', messageController.deleteMessage);
} else {
  console.error('Warning: messageController.deleteMessage is not defined');
}

// Notification routes
router.get('/notifications', messageController.getNotifications);
router.put('/notifications/:id/read', messageController.markNotificationAsRead);

module.exports = router;
