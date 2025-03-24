const Invoice = require('../models/Invoice');
const asyncHandler = require('express-async-handler'); // Assuming you use express-async-handler for error handling

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
  const { patientName, ownerName, items } = req.body;

  // Validate request
  if (!patientName || !ownerName || !items || items.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create invoice
  const invoice = new Invoice({
    patientName,
    ownerName,
    items,
    // Use spread operator to conditionally add createdBy
    ...(req.user ? { createdBy: req.user._id } : {})
  });


  // Calculate total
  invoice.calculateTotal();
  
  // Save invoice to database
  const createdInvoice = await invoice.save();

  res.status(201).json(createdInvoice);
});

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  
  // Add filter for status if provided in query
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { patientName: searchRegex },
      { ownerName: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const invoices = await Invoice.find(filter)
    .sort({ createdAt: -1 }) // Newest first
    .skip(skip)
    .limit(limit);

  const total = await Invoice.countDocuments(filter);

  res.json({
    invoices,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  res.json(invoice);
});

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Private
const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { status, paymentMethod, amountPaid } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  invoice.status = status || invoice.status;
  
  // If marking as paid, update payment details
  if (status === 'paid') {
    invoice.paymentDate = new Date();
    invoice.paymentMethod = paymentMethod || 'cash';
    invoice.amountPaid = amountPaid || invoice.total;
  } else if (status === 'partially_paid') {
    invoice.paymentDate = new Date();
    invoice.paymentMethod = paymentMethod || 'cash';
    invoice.amountPaid = amountPaid || 0;
  }

  const updatedInvoice = await invoice.save();

  res.json(updatedInvoice);
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  await invoice.remove();

  res.json({ message: 'Invoice removed' });
});

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice
};