// routes/chatbotAdminRoutes.js
//route for chatbot in admindashboard.
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatLog = mongoose.model('ChatLog');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @route   GET /api/admin/chatbot/analytics
 * @desc    Get chatbot analytics data
 * @access  Private/Admin
 */
router.get('/analytics', async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    // Calculate date range based on timeRange parameter
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7); // Default to week
    }
    
    // Get total interactions
    const totalInteractions = await ChatLog.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Get emergency triages
    const emergencyTriages = await ChatLog.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      emergencyLevel: { $ne: 'none' }
    });
    
    // Get average response time
    const responseTimeAgg = await ChatLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          responseTime: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);
    
    const averageResponseTime = responseTimeAgg.length > 0 
      ? responseTimeAgg[0].averageResponseTime / 1000 // Convert to seconds
      : 0;
    
    // Get top intents
    const topIntentsAgg = await ChatLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$intent',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    const topIntents = topIntentsAgg.map(intent => ({
      name: intent._id ? intent._id.replace(/_/g, ' ') : 'unknown',
      count: intent.count
    }));
    
    // Get emergency breakdown
    const emergencyBreakdownAgg = await ChatLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$emergencyLevel',
          value: { $sum: 1 }
        }
      }
    ]);
    
    const emergencyBreakdown = emergencyBreakdownAgg.map(level => ({
      name: level._id || 'none',
      value: level.value
    }));
    
    // Get interactions by day and satisfaction
    const interactionsByDay = [];
    
    // Calculate days between startDate and endDate
    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // For each day, get interactions and satisfaction
    for (let i = 0; i <= dayDiff; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Count interactions for this day
      const dailyInteractions = await ChatLog.countDocuments({
        createdAt: { $gte: day, $lt: nextDay }
      });
      
      // Count emergencies for this day
      const dailyEmergencies = await ChatLog.countDocuments({
        createdAt: { $gte: day, $lt: nextDay },
        emergencyLevel: { $ne: 'none' }
      });
      
      // Get average satisfaction for this day
      const satisfactionAgg = await ChatLog.aggregate([
        {
          $match: {
            createdAt: { $gte: day, $lt: nextDay },
            feedbackRating: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            averageSatisfaction: { $avg: '$feedbackRating' }
          }
        }
      ]);
      
      const dailySatisfaction = satisfactionAgg.length > 0 
        ? satisfactionAgg[0].averageSatisfaction 
        : null;
      
      interactionsByDay.push({
        date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        interactions: dailyInteractions,
        emergencies: dailyEmergencies,
        satisfaction: dailySatisfaction
      });
    }
    
    // Calculate overall satisfaction rate
    const satisfactionRateAgg = await ChatLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          feedbackRating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$feedbackRating' }
        }
      }
    ]);
    
    // Calculate percentage (based on 5-star scale)
    const satisfactionRate = satisfactionRateAgg.length > 0 
      ? Math.round((satisfactionRateAgg[0].averageRating / 5) * 100) 
      : 0;
    
    res.json({
      totalInteractions,
      emergencyTriages,
      averageResponseTime,
      topIntents,
      interactionsByDay,
      satisfactionRate,
      emergencyBreakdown
    });
    
  } catch (error) {
    console.error('Error getting chatbot analytics:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/admin/chatbot/logs
 * @desc    Get chatbot conversation logs with optional filtering
 * @access  Private/Admin
 */
router.get('/logs', async (req, res) => {
  try {
    const { timeRange = 'week', emergencyLevel, intent, limit = 100 } = req.query;
    
    // Calculate date range based on timeRange parameter
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7); // Default to week
    }
    
    // Build filter object
    const filter = {
      createdAt: { $gte: startDate, $lte: endDate }
    };
    
    if (emergencyLevel && emergencyLevel !== 'all') {
      filter.emergencyLevel = emergencyLevel;
    }
    
    if (intent && intent !== 'all') {
      filter.intent = intent;
    }
    
    // Get logs
    const logs = await ChatLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('userId', 'name email role');
    
    res.json(logs);
    
  } catch (error) {
    console.error('Error getting chatbot logs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/admin/chatbot/intents
 * @desc    Get all available chatbot intents
 * @access  Private/Admin
 */
router.get('/intents', async (req, res) => {
  try {
    // These should match the intents from the ChatLog model
    const intents = [
      { id: 'emergency_help', name: 'Emergency Help' },
      { id: 'appointment_booking', name: 'Appointment Booking' },
      { id: 'hospital_info', name: 'Hospital Info' },
      { id: 'pet_care_info', name: 'Pet Care Info' },
      { id: 'service_inquiry', name: 'Service Inquiry' },
      { id: 'pricing_inquiry', name: 'Pricing Inquiry' },
      { id: 'general_question', name: 'General Question' },
      { id: 'feedback', name: 'Feedback' },
      { id: 'greeting', name: 'Greeting' },
      { id: 'followup', name: 'Follow-up' },
      { id: 'other', name: 'Other' }
    ];
    
    res.json(intents);
    
  } catch (error) {
    console.error('Error getting chatbot intents:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/admin/chatbot/emergency-keywords
 * @desc    Get emergency keywords for chatbot configuration
 * @access  Private/Admin
 */
router.get('/emergency-keywords', async (req, res) => {
  try {
    // These should match the emergency keywords from the chatbot service
    const emergencyKeywords = {
      critical: [
        'difficulty breathing', 'not breathing', 'choking', 'unconscious', 
        'collapsed', 'seizure', 'severe bleeding', 'hit by car', 'trauma', 
        'blue gums', 'bloated abdomen', 'unable to urinate'
      ],
      urgent: [
        'vomiting blood', 'bloody diarrhea', 'ingested poison', 'eye injury',
        'broken bone', 'open wound', 'high fever', 'severe pain', 'labor problems',
        'heat stroke', 'persistent vomiting', 'swollen abdomen'
      ],
      moderate: [
        'limping', 'mild bleeding', 'coughing', 'diarrhea', 'ear infection',
        'itching', 'not eating', 'mild vomiting', 'lethargy'
      ]
    };
    
    res.json(emergencyKeywords);
    
  } catch (error) {
    console.error('Error getting chatbot emergency keywords:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   DELETE /api/admin/chatbot/logs/:id
 * @desc    Delete a specific chat log
 * @access  Private/Admin
 */
router.delete('/logs/:id', async (req, res) => {
  try {
    const log = await ChatLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Chat log not found' });
    }
    
    await log.deleteOne();
    
    res.json({ message: 'Chat log deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting chat log:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;