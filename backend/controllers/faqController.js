// controllers/faqController.js
//backend logic for handling faq

const FAQ = require('../models/FAQ');

/**
 * @route   GET /api/faqs
 * @desc    Get all FAQs with optional filtering
 * @access  Public
 */
exports.getAllFAQs = async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Only return active FAQs for public requests
    if (activeOnly === 'true' || !req.user || req.user.role !== 'Admin') {
      filter.isActive = true;
    }
    
    // Handle text search if provided
    if (search) {
      filter.$text = { $search: search };
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
};

/**
 * @route   GET /api/faqs/:id
 * @desc    Get a specific FAQ by ID
 * @access  Public
 */
exports.getFAQById = async (req, res) => {
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
};

/**
 * @route   POST /api/faqs
 * @desc    Create a new FAQ
 * @access  Private/Admin
 */
exports.createFAQ = async (req, res) => {
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
    
    await newFAQ.save();
    
    res.status(201).json({
      message: 'FAQ created successfully',
      faq: newFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @route   PUT /api/faqs/:id
 * @desc    Update an existing FAQ
 * @access  Private/Admin
 */
exports.updateFAQ = async (req, res) => {
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
    
    await faq.save();
    
    res.json({
      message: 'FAQ updated successfully',
      faq
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @route   DELETE /api/faqs/:id
 * @desc    Delete a FAQ
 * @access  Private/Admin
 */
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    await faq.remove();
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @route   GET /api/faqs/categories
 * @desc    Get all FAQ categories
 * @access  Public
 */
exports.getFAQCategories = async (req, res) => {
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
};

/**
 * @route   PUT /api/faqs/:id/toggle-status
 * @desc    Toggle FAQ active status
 * @access  Private/Admin
 */
exports.toggleFAQStatus = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Toggle status
    faq.isActive = !faq.isActive;
    faq.updatedBy = req.user.id;
    
    await faq.save();
    
    res.json({
      message: `FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully`,
      faq
    });
  } catch (error) {
    console.error('Error toggling FAQ status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};