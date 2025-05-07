// models/FAQ.js
//model for store faq
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    keywords: [{
      type: String,
      trim: true
    }],
    category: {
      type: String,
      required: true,
      enum: [
        'hospital_info',
        'services',
        'appointments',
        'payment',
        'pet_care',
        'emergency',
        'medications',
        'boarding',
        'other'
      ]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Create text index for full-text search capabilities
faqSchema.index(
  { 
    question: 'text', 
    answer: 'text', 
    keywords: 'text' 
  },
  {
    weights: {
      question: 10,
      keywords: 5,
      answer: 1
    },
    name: 'faq_text_index'
  }
);

module.exports = mongoose.model('FAQ', faqSchema);