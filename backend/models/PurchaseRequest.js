// backend/models/PurchaseRequest.js


//Purchase Request Model:

const mongoose = require('mongoose');

const PurchaseRequestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Item is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },



  paymentDetails: {
    paymentMethod: String,
    transactionId: String,
    paymentDate: Date
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to calculate total amount
PurchaseRequestSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);

