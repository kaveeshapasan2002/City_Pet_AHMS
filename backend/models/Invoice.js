const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const invoiceSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required']
  },
  items: {
    type: [invoiceItemSchema],
    required: [true, 'Invoice must contain at least one item'],
    validate: {
      validator: function(items) {
        return items.length > 0;
      },
      message: 'Invoice must contain at least one item'
    }
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  //try to pass those variable 
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'partially_paid', 'cancelled'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'check', 'bank_transfer', '']
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Method to calculate total
invoiceSchema.methods.calculateTotal = function() {
  this.total = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  return this.total;
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;