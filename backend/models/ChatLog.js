// models/ChatLog.js
const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allow anonymous chats
    },
    sessionId: {
      type: String,
      required: true, // Generated for tracking conversation sessions
    },
    userMessage: {
      type: String,
      required: true,
    },
    botResponse: {
      type: String,
      required: true,
    },
    emergencyLevel: {
      type: String,
      enum: ['none', 'moderate', 'urgent', 'critical'],
      default: 'none',
    },
    intent: {
      type: String,
      enum: [
        'emergency_help',
        'appointment_booking',
        'hospital_info',
        'pet_care_info',
        'service_inquiry',
        'pricing_inquiry',
        'general_question',
        'feedback',
        'greeting',
        'followup',
        'other'
      ],
      default: 'other'
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    userAgent: {
      type: String,
      required: false
    },
    ipAddress: {
      type: String,
      required: false
    },
    responseTime: {
      type: Number, // Response time in milliseconds
      required: false
    },
    feedbackRating: {
      type: Number, // User feedback 1-5
      min: 1,
      max: 5,
      required: false
    },
    feedbackComment: {
      type: String,
      required: false
    },
    escalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: {
      type: String,
      required: false // Staff member ID or role
    },
    handledByHuman: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for efficient querying
chatLogSchema.index({ sessionId: 1, createdAt: 1 });
chatLogSchema.index({ userId: 1, createdAt: 1 });
chatLogSchema.index({ intent: 1, createdAt: 1 });
chatLogSchema.index({ emergencyLevel: 1, createdAt: 1 });

// Add text index for search capabilities
chatLogSchema.index(
  { 
    userMessage: 'text', 
    botResponse: 'text'
  },
  {
    weights: {
      userMessage: 10,
      botResponse: 5
    },
    name: 'chatlog_text_index'
  }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);