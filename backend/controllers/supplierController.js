// backend/controllers/supplierController.js
const Supplier = require('../models/Supplier');
const asyncHandler = require('express-async-handler');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
exports.getSuppliers = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = { isActive: true };
  
  if (category && category !== 'All categories') {
    filter.category = category;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Query with pagination
  const suppliers = await Supplier.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ name: 1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');
  
  // Get total count
  const total = await Supplier.countDocuments(filter);
  
  // Count by category (for stats)
  const categories = await Supplier.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  const categoryStats = {};
  categories.forEach(cat => {
    categoryStats[cat._id] = cat.count;
  });
  
  res.status(200).json({
    suppliers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    stats: {
      totalSuppliers: total,
      categories: Object.keys(categoryStats).length,
      categoryBreakdown: categoryStats
    }
  });
});

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private
exports.getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  res.status(200).json(supplier);
});

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
exports.createSupplier = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    contactPerson,
    email,
    phone,
    address,
    notes,
    preferredPaymentTerms
  } = req.body;

  // Check if supplier with the same name already exists
  const existingSupplier = await Supplier.findOne({ name });
  if (existingSupplier) {
    res.status(400);
    throw new Error('Supplier with this name already exists');
  }

  const supplier = await Supplier.create({
    name,
    category,
    contactPerson,
    email,
    phone,
    address,
    notes,
    preferredPaymentTerms: preferredPaymentTerms || 'Net 30',
    createdBy: req.user.id,
    updatedBy: req.user.id
  });

  if (supplier) {
    res.status(201).json(supplier);
  } else {
    res.status(400);
    throw new Error('Invalid supplier data');
  }
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
exports.updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Update the updatedBy field
  req.body.updatedBy = req.user.id;
  
  const updatedSupplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name')
    .populate('updatedBy', 'name');

  res.status(200).json(updatedSupplier);
});

// @desc    Delete supplier (soft delete)
// @route   DELETE /api/suppliers/:id
// @access  Private
exports.deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Soft delete - mark as inactive
  supplier.isActive = false;
  supplier.updatedBy = req.user.id;
  await supplier.save();

  res.status(200).json({ message: 'Supplier removed' });
});

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats
// @access  Private
exports.getSupplierStats = asyncHandler(async (req, res) => {
  // Get all active suppliers
  const totalSuppliers = await Supplier.countDocuments({ isActive: true });
  
  // Group by category
  const categories = await Supplier.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  const categoryBreakdown = {};
  categories.forEach(cat => {
    categoryBreakdown[cat._id] = cat.count;
  });

  res.status(200).json({
    totalSuppliers,
    categories: categories.length,
    categoryBreakdown
  });
});