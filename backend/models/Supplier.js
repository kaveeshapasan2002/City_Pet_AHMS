// backend/models/Supplier.js
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Supplier name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['Medication', 'Supply', 'Equipment', 'Food', 'Other']
  },
  contactPerson: {
    type: String,
    required: [true, "Contact person is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  preferredPaymentTerms: {
    type: String,
    enum: ['Net 30', 'Net 60', 'Net 90', 'Immediate', 'Other'],
    default: 'Net 30'
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

// Virtual for items supplied by this supplier (if needed later)
SupplierSchema.virtual('items', {
  ref: 'Inventory',
  localField: '_id',
  foreignField: 'supplier'
});

// Update the updatedAt timestamp on save
SupplierSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Supplier', SupplierSchema);