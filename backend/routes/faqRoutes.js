// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FAQ = mongoose.model('FAQ');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * @route   GET /api/faqs/categories
 * @desc    Get all FAQ categories
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    // These should match the categories from the FAQ model
    const categories = [
      { id: 'hospital_info', name: 'Hospital Information' },
      { id: 'services', name: 'Services' },
      { id: 'appointments', name: 'Appointments' },
      { id: 'payment', name: 'Payment & Insurance' },
      { id: 'pet_care', name: 'Pet Care' },
      { id: 'emergency', name: 'Emergency Care' },
      { id: 'medications', name: 'Medications & Prescriptions' },
      { id: 'boarding', name: 'Boarding & Grooming' },
      { id: 'other', name: 'Other' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/faqs
 * @desc    Get all FAQs with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Only return active FAQs for public requests
    if (activeOnly === 'true' || (!req.user || req.user.role !== 'Admin')) {
      filter.isActive = true;
    }
    
    // Handle text search if provided
    if (search) {
      // If text index exists on the FAQ model
      if (FAQ.schema.paths.question._index && FAQ.schema.paths.answer._index) {
        filter.$text = { $search: search };
      } else {
        // Fallback to regex search
        filter.$or = [
          { question: { $regex: search, $options: 'i' } },
          { answer: { $regex: search, $options: 'i' } }
        ];
        
        // Add keyword search if keywords field exists
        if (FAQ.schema.paths.keywords) {
          filter.$or.push({ keywords: { $in: [new RegExp(search, 'i')] } });
        }
      }
    }
    
    // Get FAQs with sorting
    const faqs = await FAQ.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
    
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   GET /api/faqs/:id
 * @desc    Get a specific FAQ by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Only return active FAQs for public requests
    if (!faq.isActive && (!req.user || req.user.role !== 'Admin')) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   POST /api/faqs
 * @desc    Create a new FAQ
 * @access  Private/Admin
 */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { question, answer, keywords, category, priority, isActive } = req.body;
    
    // Validate required fields
    if (!question || !answer || !category) {
      return res.status(400).json({ message: 'Question, answer, and category are required' });
    }
    
    // Create new FAQ
    const newFAQ = new FAQ({
      question,
      answer,
      keywords: keywords || [],
      category,
      priority: priority || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });
    
    // Save to database
    await newFAQ.save();
    
    res.status(201).json({
      message: 'FAQ created successfully',
      faq: newFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   PUT /api/faqs/:id
 * @desc    Update an existing FAQ
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { question, answer, keywords, category, priority, isActive } = req.body;
    
    // Find FAQ
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Update fields
    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.keywords = keywords || faq.keywords;
    faq.category = category || faq.category;
    faq.priority = priority !== undefined ? priority : faq.priority;
    faq.isActive = isActive !== undefined ? isActive : faq.isActive;
    faq.updatedBy = req.user.id;
    
    // Save to database
    await faq.save();
    
    res.json({
      message: 'FAQ updated successfully',
      faq
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   DELETE /api/faqs/:id
 * @desc    Delete a FAQ
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Delete from database
    await faq.deleteOne();
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route   PUT /api/faqs/:id/toggle-status
 * @desc    Toggle FAQ active status
 * @access  Private/Admin
 */
router.put('/:id/toggle-status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Toggle status
    faq.isActive = !faq.isActive;
    faq.updatedBy = req.user.id;
    
    // Save to database
    await faq.save();
    
    res.json({
      message: `FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully`,
      faq
    });
  } catch (error) {
    console.error('Error toggling FAQ status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;