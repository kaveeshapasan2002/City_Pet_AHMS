// routes/messageRoutes.js - Updated version with delete/update routes
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
// New routes for update/delete
router.put('/messages/:id', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);

// Notification routes
router.get('/notifications', messageController.getNotifications);
router.put('/notifications/:id/read', messageController.markNotificationAsRead);

module.exports = router;