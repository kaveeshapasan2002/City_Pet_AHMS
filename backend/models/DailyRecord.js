// models/DailyRecord.js
const mongoose = require('mongoose');

const dailyRecordSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    feedingNotes: String,
    activityNotes: String,
    healthNotes: String,
    behaviorNotes: String,
    photos: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);