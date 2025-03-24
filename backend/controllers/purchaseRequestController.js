// backend/controllers/purchaseRequestController.js


//Purchase Request Controller:


const PurchaseRequest = require('../models/PurchaseRequest');
const Inventory = require('../models/Inventory');
const asyncHandler = require('express-async-handler');

// @desc    Create a new purchase request
// @route   POST /api/purchase-requests
// @access  Private
exports.createPurchaseRequest = asyncHandler(async (req, res) => {
  const { item, quantity } = req.body;

  // Find the inventory item
  const inventoryItem = await Inventory.findById(item);
  if (!inventoryItem) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  // Create purchase request
  const purchaseRequest = await PurchaseRequest.create({
    item,
    quantity,
    unitPrice: inventoryItem.unitPrice,
    totalAmount: quantity * inventoryItem.unitPrice,
    requestedBy: req.user.id,
    status: 'Pending'
  });

  res.status(201).json(purchaseRequest);
});

// @desc    Get purchase requests
// @route   GET /api/purchase-requests
// @access  Private
exports.getPurchaseRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Build filter
  const filter = {};
  if (status) {
    filter.status = status;
  }

  // Fetch purchase requests with populated item details
  const purchaseRequests = await PurchaseRequest.find(filter)
    .populate('item', 'name category')
    .populate('requestedBy', 'name')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(purchaseRequests);
});

// @desc    Update purchase request status
// @route   PATCH /api/purchase-requests/:id
// @access  Private (Admin)
exports.updatePurchaseRequestStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const purchaseRequest = await PurchaseRequest.findById(req.params.id);
  if (!purchaseRequest) {
    res.status(404);
    throw new Error('Purchase request not found');
  }

  // Update purchase request
  purchaseRequest.status = status;
  purchaseRequest.approvedBy = req.user.id;
  if (notes) purchaseRequest.notes = notes;

  // If approved and completed, update inventory
  if (status === 'Completed') {
    const inventoryItem = await Inventory.findById(purchaseRequest.item);
    inventoryItem.quantity += purchaseRequest.quantity;
    await inventoryItem.save();
  }

  await purchaseRequest.save();

  res.status(200).json(purchaseRequest);
});

// @desc    Delete purchase request
// @route   DELETE /api/purchase-requests/:id
// @access  Private
exports.deletePurchaseRequest = asyncHandler(async (req, res) => {
  const purchaseRequest = await PurchaseRequest.findById(req.params.id);

  if (!purchaseRequest) {
    res.status(404);
    throw new Error('Purchase request not found');
  }

  // Ensure only the requester or admin can delete
  if (purchaseRequest.requestedBy.toString() !== req.user.id && 
      req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this purchase request');
  }

  await purchaseRequest.deleteOne();

  res.status(200).json({ message: 'Purchase request removed' });
});

