// controllers/dailyRecordController.js
const DailyRecord = require('../models/DailyRecord');
const Boarding = require('../models/Boarding');

// Get daily records for a booking
exports.getDailyRecords = async (req, res) => {
  try {
    const booking = await Boarding.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check permission
    if (booking.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const records = await DailyRecord.find({ booking: req.params.id })
      .sort({ date: -1 });
    
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a daily record for a booking (admin only)
exports.addDailyRecord = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Verify booking exists
    const booking = await Boarding.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Create new record
    const newRecord = new DailyRecord({
      booking: req.params.id,
      date: req.body.date,
      feedingNotes: req.body.feedingNotes,
      activityNotes: req.body.activityNotes,
      healthNotes: req.body.healthNotes,
      behaviorNotes: req.body.behaviorNotes,
      photos: req.body.photos || [],
      createdBy: req.user.id
    });
    
    await newRecord.save();
    
    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};