// backend/controllers/inventoryReorderController.js
const asyncHandler = require('express-async-handler');
const inventoryReorderService = require('../utils/inventoryReorderService');

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private
exports.getLowStockItems = asyncHandler(async (req, res) => {
  const lowStockItems = await inventoryReorderService.getLowStockItems();
  
  res.status(200).json({
    success: true,
    count: lowStockItems.length,
    items: lowStockItems
  });
});

// @desc    Process auto reorder for low stock items
// @route   POST /api/inventory/auto-reorder
// @access  Private
exports.processAutoReorder = asyncHandler(async (req, res) => {
  // Process the auto reorder using the user's ID who initiated it
  const result = await inventoryReorderService.processAutoReorder(req.user.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});