// backend/models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['Medication', 'Supply', 'Equipment', 'Food', 'Other']
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: 0
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    trim: true
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: 0
  },
  location: {
    type: String,
    required: [true, "Storage location is required"],
    trim: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to calculate total value
InventorySchema.virtual('totalValue').get(function() {
  return this.quantity * this.unitPrice;
});

// Method to check if item is low in stock
InventorySchema.methods.isLowInStock = function() {
  return this.quantity <= this.lowStockThreshold;
};

// Update the updatedAt timestamp on save
InventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', InventorySchema);