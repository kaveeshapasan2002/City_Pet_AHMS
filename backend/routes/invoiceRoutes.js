// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  recordPayment,
  deleteInvoice,
  getClientInvoices,
  getPetInvoices
} = require("../controllers/invoiceController");
const { emailInvoice } = require("../controllers/invoiceEmailController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all invoices - admin and staff only
router.get("/", getAllInvoices);

// Get invoice by id
router.get("/:id", getInvoiceById);

// Create new invoice
router.post("/", createInvoice);

// Update invoice
router.put("/:id", updateInvoice);

// Record payment
router.post("/:id/payment", recordPayment);

// Delete invoice - admin only
router.delete("/:id", adminMiddleware, deleteInvoice);

// Get client invoice history
router.get("/client/:clientId", getClientInvoices);

// Get pet invoice history
router.get("/pet/:petId", getPetInvoices);

// Send invoice via email
router.post("/:id/email", emailInvoice);

module.exports = router;
