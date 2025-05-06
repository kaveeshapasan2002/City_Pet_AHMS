// models/InvoiceModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    //required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  patientId: {
    type: String,
    required: true,
    ref: "PetModel"
  },
  patientName: {
    type: String,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User"
  },
  clientName: {
    type: String,
    required: true
  },
  clientContact: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppointmentModel"
  },
  items: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      },
      description: String,
      quantity: {
        type: Number,
        default: 1
      },
      unitPrice: Number,
      discount: {
        type: Number,
        default: 0
      },
      amount: Number
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Partially Paid", "Paid"],
    default: "Unpaid"
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Credit Card", "Debit Card", "Online", "Check", "Insurance"],
    default: "Cash"
  },
  paymentDate: {
    type: Date
  },
  paymentHistory: [
    {
      amount: Number,
      method: String,
      date: {
        type: Date,
        default: Date.now
      },
      reference: String
    }
  ],
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, 
{ timestamps: true });

// Generate invoice number automatically
invoiceSchema.pre("save", async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    // Get the count of existing invoices
    const count = await this.constructor.countDocuments();
    
    // Generate the invoice number: INV-YY-MM-XXXX (where XXXX is sequential)
    this.invoiceNumber = `INV-${year}-${month}-${(count + 1).toString().padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);