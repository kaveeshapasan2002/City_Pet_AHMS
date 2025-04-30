// controllers/messageController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/smsService');
const asyncHandler = require('express-async-handler');

// Get all conversations for the current user //active conversations  ffefefda
exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user.id,
    status: 'active'
  })
  .populate('participants', 'name email role profilePicture')
  .sort({ lastMessageTime: -1 });
  
  res.json(conversations);
});


// Get a specific conversation
exports.getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user.id
  }).populate('participants', 'name email role profilePicture');
  
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  // Reset unread count for this user
  if (conversation.unreadCount && conversation.unreadCount.has(req.user.id.toString())) {
    conversation.unreadCount.set(req.user.id.toString(), 0);
    await conversation.save();
  }
  
  res.json(conversation);
});

// Create a new conversation
exports.createConversation = asyncHandler(async (req, res) => {
  const { receiverId, initialMessage } = req.body;
  
  // Verify that the receiver exists and is not the current user
  if (receiverId === req.user.id) {
    return res.status(400).json({ message: 'Cannot create conversation with yourself' });
  }
  
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: 'Receiver not found' });
  }
  
  // Check if a conversation already exists between these users
  const existingConversation = await Conversation.findOne({
    participants: { $all: [req.user.id, receiverId] },
    status: 'active'
  });
  
  if (existingConversation) {
    return res.json(existingConversation);
  }
  
  // Create a new conversation
  const newConversation = new Conversation({
    participants: [req.user.id, receiverId],
    lastMessage: initialMessage || '',
    lastMessageTime: new Date()
  });
  
  // Initialize unread count for receiver
  newConversation.unreadCount.set(receiverId, initialMessage ? 1 : 0);
  
  await newConversation.save();
  
  // If there's an initial message, create it
  if (initialMessage) {
    const message = new Message({
      conversationId: newConversation._id,
      sender: req.user.id,
      content: initialMessage
    });
    
    await message.save();
    
    // Create notification for the receiver
    const notification = new Notification({
      recipient: receiverId,
      type: 'message',
      content: `New message from ${req.user.name}`,
      relatedId: newConversation._id,
      onModel: 'Conversation'
    });
    
    await notification.save();
    
    // Send external notifications if enabled for the user
    handleExternalNotifications(receiverId, req.user.name, initialMessage, newConversation._id);
  }
  
  // Populate the participants before sending response
  const populatedConversation = await Conversation.findById(newConversation._id)
    .populate('participants', 'name email role profilePicture');
  
  res.status(201).json(populatedConversation);
});

// Get messages from a conversation
exports.getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  
  // Verify the user is part of this conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user.id
  });
  
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name role profilePicture');
    
  // Mark messages as read
  await Message.updateMany(
    { 
      conversationId,
      sender: { $ne: req.user.id },
      'readBy.userId': { $ne: req.user.id }
    },
    { 
      $push: { 
        readBy: { 
          userId: req.user.id,
          readAt: new Date()
        } 
      } 
    }
  );
  
  // Reset unread count for this user in the conversation
  if (conversation.unreadCount && conversation.unreadCount.has(req.user.id.toString())) {
    conversation.unreadCount.set(req.user.id.toString(), 0);
    await conversation.save();
  }
  
  // Get total count for pagination
  const total = await Message.countDocuments({ conversationId });
  
  res.json({
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Send a new message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content, attachments } = req.body;
  
  if (!content && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }
  
  // Verify the user is part of this conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user.id
  });
  
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  // Create the message
  const message = new Message({
    conversationId,
    sender: req.user.id,
    content,
    attachments: attachments || [],
    readBy: [{ userId: req.user.id }] // Mark as read by sender
  });
  
  await message.save();
  
  // Update the conversation with last message info
  conversation.lastMessage = content;
  conversation.lastMessageTime = new Date();
  
  // Increment unread count for other participants
  conversation.participants.forEach(participantId => {
    if (participantId.toString() !== req.user.id.toString()) {
      const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
      conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      
      // Create notification for each recipient
      createMessageNotification(participantId, req.user.id, req.user.name, content, conversationId);
    }
  });
  
  await conversation.save();
  
  // Populate sender info before responding
  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name role profilePicture');
  
  res.status(201).json(populatedMessage);
});

// Archive a conversation
exports.archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user.id
  });
  
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  conversation.status = 'archived';
  await conversation.save();
  
  res.json({ message: 'Conversation archived successfully' });
});

// Get all notifications for the current user
exports.getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  // Get total count for pagination
  const total = await Notification.countDocuments({ recipient: req.user.id });
  
  res.json({
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Mark notification as read
exports.markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id
  });
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  notification.isRead = true;
  await notification.save();
  
  res.json({ message: 'Notification marked as read' });
});

// Helper function to create a message notification
async function createMessageNotification(recipientId, senderId, senderName, messageContent, conversationId) {
  // Create in-app notification
  const notification = new Notification({
    recipient: recipientId,
    type: 'message',
    content: `New message from ${senderName}`,
    relatedId: conversationId,
    onModel: 'Conversation'
  });
  
  await notification.save();
  
  // Handle external notifications
  handleExternalNotifications(recipientId, senderName, messageContent, conversationId);
}

// Helper function to handle external notifications (email, SMS)
async function handleExternalNotifications(recipientId, senderName, messageContent, conversationId) {
  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) return;
    
    // Send email notification if user has email notifications enabled
    // This would be controlled by user preferences in a real application
    sendEmailNotification(recipient, senderName, messageContent, conversationId);
    
    // Send SMS notification if user has SMS notifications enabled
    // This would be controlled by user preferences in a real application
    sendSMSNotification(recipient, senderName, messageContent);
    
  } catch (error) {
    console.error('Error sending external notifications:', error);
  }
}

// Helper function for email notifications
async function sendEmailNotification(recipient, senderName, messageContent, conversationId) {
  try {
    const subject = `New message from ${senderName}`;
    const text = `
      Hello ${recipient.name},
      
      You have a new message from ${senderName}:
      
      "${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}"
      
      Click the link below to view and respond:
      ${process.env.FRONTEND_URL}/messages/conversation/${conversationId}
      
      Regards,
      Pet Hospital Team
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
          <h1>New Message</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello ${recipient.name},</p>
          <p>You have a new message from <strong>${senderName}</strong>:</p>
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            "${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}"
          </div>
          <p><a href="${process.env.FRONTEND_URL}/messages/conversation/${conversationId}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View and Respond</a></p>
          <p>Regards,<br>Pet Hospital Team</p>
        </div>
      </div>
    `;
    
    await sendEmail(recipient.email, subject, text, html);
    
    // Update notification record to reflect email was sent
    await Notification.findOneAndUpdate(
      { recipient: recipient._id, relatedId: conversationId, type: 'message' },
      { isEmailSent: true }
    );
    
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Helper function for SMS notifications
async function sendSMSNotification(recipient, senderName, messageContent) {
  try {
    if (!recipient.phonenumber) return;
    
    const message = `
      Pet Hospital: New message from ${senderName}:
      "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}"
      Reply online at our portal.
    `;
    
    await sendSMS(recipient.phonenumber, message);
    
    // Update notification record to reflect SMS was sent
    await Notification.findOneAndUpdate(
      { recipient: recipient._id, type: 'message' },
      { isSMSSent: true }
    );
    
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
}