// backend/routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  getSupplierStats
} = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');

// Add a test route that doesn't require authentication
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Supplier API is working!' });
});

// Apply auth middleware to all other routes
router.use(authMiddleware);

// Get supplier statistics
router.get('/stats', getSupplierStats);

// Supplier routes
router.route('/')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/:id')
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;