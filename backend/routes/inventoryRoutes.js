// backend/routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getInventoryItems, 
  getInventoryItemById, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  getInventoryStats
} = require('../controllers/inventoryController');

const {
  getLowStockItems,
  processAutoReorder
} = require('../controllers/inventoryReorderController');

const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get inventory statistics
router.get('/stats', getInventoryStats);

// Get low stock items
router.get('/low-stock', getLowStockItems);

// Process auto reorder
router.post('/auto-reorder', processAutoReorder);

// Inventory item routes
router.route('/')
  .get(getInventoryItems)
  .post(createInventoryItem);

router.route('/:id')
  .get(getInventoryItemById)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;