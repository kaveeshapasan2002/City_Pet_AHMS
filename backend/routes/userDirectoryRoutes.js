// routes/userDirectoryRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all veterinarians
router.get('/veterinarians', async (req, res) => {
  try {
    const veterinarians = await User.find({ role: 'Veterinarian', isActive: true })
      .select('name email role profilePicture specialization');
      
    res.json(veterinarians);
  } catch (error) {
    console.error('Error fetching veterinarians:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all pet owners
router.get('/pet-owners', async (req, res) => {
  try {
    const petOwners = await User.find({ role: 'Pet Owner', isActive: true })
      .select('name email role profilePicture pets');
      
    res.json(petOwners);
  } catch (error) {
    console.error('Error fetching pet owners:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;