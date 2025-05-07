// routes/chatbotRoutes.js
//route for chatbot 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatLog = mongoose.model('ChatLog');
const FAQ = mongoose.model('FAQ');

// Import the chatbot service
const chatbotService = require('../services/chatbotService');

/**
 * @route   POST /api/chatbot/message
 * @desc    Process chatbot message and return response
 * @access  Public
 */
router.post('/message', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;
    console.log(`Route received message: "${message}" from ${userId || 'anonymous'}, session: ${sessionId || 'new'}`);
    
    // Check if message is provided
    if (!message) {
      return res.status(400).json({ 
        response: 'Please provide a message to continue our conversation.',
        emergencyLevel: 'none',
        intent: 'error',
        source: 'validation_error'
      });
    }
    
    // First check if there are any FAQs in the database
    let faqCount = 0;
    try {
      faqCount = await FAQ.countDocuments();
      console.log(`Current FAQ count in database: ${faqCount}`);
    } catch (dbError) {
      console.error('Error counting FAQs:', dbError);
      // Continue even if this fails
    }
    
    const startTime = Date.now();
    
    // Add error handling around the chatbot service call
    let serviceResponse;
    try {
      // Use the chatbot service to process the message
      serviceResponse = await chatbotService.processMessage(message, userId, sessionId);
      console.log('Service response source:', serviceResponse.source || 'unknown');
    } catch (serviceError) {
      console.error('Error in chatbot service:', serviceError);
      // Provide a fallback response if service fails
      serviceResponse = {
        response: "I'm sorry, I'm experiencing technical difficulties. Please try again or call our office directly at (555) 123-4567.",
        emergencyLevel: 'none',
        intent: 'error',
        source: 'fallback'
      };
    }
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Log the interaction
    let chatLogId;
    try {
      const chatLog = new ChatLog({
        userId: userId || null,
        sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
        userMessage: message,
        botResponse: serviceResponse.response,
        emergencyLevel: serviceResponse.emergencyLevel || 'none',
        responseTime,
        intent: serviceResponse.intent || 'general_question',
        source: serviceResponse.source || 'fallback'
      });
      
      const savedLog = await chatLog.save();
      chatLogId = savedLog._id;
      console.log(`Saved chat log with ID: ${chatLogId}`);
    } catch (logError) {
      console.error('Error logging chat interaction:', logError);
      // Don't fail the request if logging fails
    }
    
    // Send the response to the client
    res.json({
      ...serviceResponse,
      messageId: chatLogId
    });
    
  } catch (error) {
    console.error('Chatbot route error:', error);
    res.status(500).json({ 
      response: 'I seem to be having trouble right now. For immediate assistance, please call our hospital at (555) 123-4567.',
      emergencyLevel: 'none',
      intent: 'error',
      source: 'error'
    });
  }
});

/**
 * @route   POST /api/chatbot/feedback
 * @desc    Submit feedback for a chatbot message
 * @access  Public
 */
router.post('/feedback', async (req, res) => {
  try {
    const { messageId, rating, comment } = req.body;
    
    if (!messageId || !rating) {
      return res.status(400).json({ message: 'Message ID and rating are required' });
    }
    
    const success = await chatbotService.processFeedback(messageId, rating, comment);
    
    if (success) {
      res.json({ message: 'Feedback submitted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to process feedback' });
    }
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/chatbot/faqs
 * @desc    Get all active FAQs
 * @access  Public
 */
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .select('question answer category keywords')
      .sort({ priority: -1, createdAt: -1 });
      
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/chatbot/history/:sessionId
 * @desc    Get chat history for a session
 * @access  Public
 */
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    const chatLogs = await ChatLog.find({ sessionId })
      .sort({ createdAt: 1 })
      .select('userMessage botResponse emergencyLevel createdAt feedbackRating');
    
    res.json(chatLogs);
    
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * Simple test endpoint to verify the chatbot API is working
 */
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Chatbot API is working!',
    time: new Date().toISOString()
  });
});

/**
 * Test endpoint to verify database connection
 */
router.get('/test-db', async (req, res) => {
  try {
    const faqCount = await FAQ.estimatedDocumentCount();
    const chatLogCount = await ChatLog.estimatedDocumentCount();
    
    res.json({
      status: 'ok',
      database: 'connected',
      counts: {
        faqs: faqCount,
        chatLogs: chatLogCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      database: 'error'
    });
  }
});

module.exports = router;