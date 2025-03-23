// backend/controllers/inventoryController.js
const Inventory = require('../models/Inventory');
const asyncHandler = require('express-async-handler');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getInventoryItems = asyncHandler(async (req, res) => {
  const { category, search, lowStock, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = { isActive: true };
  
  if (category && category !== 'All categories') {
    filter.category = category;
  }
  
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // First get all items for stats and filtering
  const allItems = await Inventory.find(filter);
  
  // Apply low stock filter if requested
  let itemsToReturn = allItems;
  if (lowStock === 'true') {
    itemsToReturn = allItems.filter(item => item.quantity <= item.lowStockThreshold);
  }
  
  // Get paginated results
  const paginatedItems = itemsToReturn.slice(skip, skip + parseInt(limit));
  
  // Calculate stats
  const totalItems = allItems.length;
  const lowStockItems = allItems.filter(item => item.quantity <= item.lowStockThreshold).length;
  const categories = [...new Set(allItems.map(item => item.category))].length;
  const inventoryValue = allItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  
  res.status(200).json({
    items: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: itemsToReturn.length,
      pages: Math.ceil(itemsToReturn.length / parseInt(limit))
    },
    stats: {
      totalItems,
      lowStockItems,
      categories,
      inventoryValue
    }
  });
});

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItemById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name');

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  res.status(200).json(item);
});

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
exports.createInventoryItem = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    quantity,
    unit,
    unitPrice,
    location,
    expiryDate,
    lowStockThreshold,
    description
  } = req.body;

  // Check if item with the same name already exists
  const existingItem = await Inventory.findOne({ name });
  if (existingItem) {
    res.status(400);
    throw new Error('Item with this name already exists');
  }

  const item = await Inventory.create({
    name,
    category,
    quantity,
    unit,
    unitPrice,
    location,
    expiryDate: expiryDate || null,
    lowStockThreshold: lowStockThreshold || 10,
    description,
    createdBy: req.user.id,
    updatedBy: req.user.id
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
exports.updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Update the updatedBy field
  req.body.updatedBy = req.user.id;
  
  const updatedItem = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedItem);
});

// @desc    Delete inventory item (soft delete)
// @route   DELETE /api/inventory/:id
// @access  Private
exports.deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Soft delete - mark as inactive
  item.isActive = false;
  item.updatedBy = req.user.id;
  await item.save();

  res.status(200).json({ message: 'Item removed' });
});

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private
exports.getInventoryStats = asyncHandler(async (req, res) => {
  // Get all active items
  const items = await Inventory.find({ isActive: true });
  
  // Calculate stats
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold).length;
  const categories = [...new Set(items.map(item => item.category))].length;
  const inventoryValue = items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);

  res.status(200).json({
    totalItems,
    lowStockItems,
    categories,
    inventoryValue
  });
});