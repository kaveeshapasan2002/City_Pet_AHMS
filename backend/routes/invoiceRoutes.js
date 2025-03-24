const express = require('express');
const router = express.Router();
const { 
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice
} = require('../controllers/invoiceController');
///const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Main invoice routes
router.route('/')
  .post(createInvoice)
  .get(getInvoices);

// Individual invoice routes
router.route('/:id')
  .get(getInvoiceById)
  .delete(deleteInvoice);

// Update invoice status (for payments)
router.route('/:id/status')
  .patch(updateInvoiceStatus);

module.exports = router;