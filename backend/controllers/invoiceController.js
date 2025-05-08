// controllers/invoiceController.js
const Invoice = require("../models/InvoiceModel");
const Pet = require("../models/PetModel");
const User = require("../models/User");
const Appointment = require("../models/AppointmentModel");
const Service = require("../models/ServiceModel");

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ date: -1 })
      .populate("clientId", "name email")
      .populate("items.service", "name");
    
    res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("clientId", "name email phonenumber")
      .populate("items.service")
      .populate("createdBy", "name");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    res.status(200).json({ invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new invoice
// Create new invoice
const createInvoice = async (req, res) => {
    try {
      const {
        patientId,
        clientId,
        clientName,
        clientContact,
        clientEmail,
        appointmentId,
        items,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        paymentStatus,
        paymentMethod,
        notes,
        dueDate
      } = req.body;
      
      // Find pet information
      const pet = await Pet.findOne({ id: patientId });
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Initialize client data
      let clientData = {
        name: clientName,
        contact: clientContact,
        email: clientEmail
      };
      
      // If clientId is provided, verify it exists
      if (clientId && clientId.trim() !== '') {
        const client = await User.findById(clientId);
        if (!client) {
          return res.status(404).json({ message: "Client not found" });
        }
        
        // Use client data from database
        clientData = {
          id: client._id,
          name: client.name,
          contact: client.phonenumber,
          email: client.email
        };
      }
      
      // Calculate due date if not provided
      const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      const newInvoice = new Invoice({
        patientId,
        patientName: pet.name,
        clientId: clientData.id || null, // Allow null clientId
        clientName: clientData.name,
        clientContact: clientData.contact,
        clientEmail: clientData.email,
        appointmentId,
        items,
        subtotal,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        discountAmount: discountAmount || 0,
        total,
        paymentStatus: paymentStatus || "Unpaid",
        paymentMethod: paymentMethod || "Cash",
        notes,
        dueDate: calculatedDueDate,
        createdBy: req.user.id
      });
      
      await newInvoice.save();
      
      res.status(201).json({ 
        message: "Invoice created successfully", 
        invoice: newInvoice 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      total,
      paymentStatus,
      paymentMethod,
      notes
    } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Update fields
    if (items) invoice.items = items;
    if (subtotal) invoice.subtotal = subtotal;
    if (taxRate !== undefined) invoice.taxRate = taxRate;
    if (taxAmount !== undefined) invoice.taxAmount = taxAmount;
    if (discountAmount !== undefined) invoice.discountAmount = discountAmount;
    if (total) invoice.total = total;
    if (paymentStatus) invoice.paymentStatus = paymentStatus;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;
    if (notes) invoice.notes = notes;
    
    invoice.updatedBy = req.user.id;
    
    await invoice.save();
    
    res.status(200).json({ 
      message: "Invoice updated successfully", 
      invoice 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Record payment
const recordPayment = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Add payment to history
    invoice.paymentHistory.push({
      amount,
      method,
      date: new Date(),
      reference
    });
    
    // Calculate total paid
    const totalPaid = invoice.paymentHistory.reduce(
      (sum, payment) => sum + payment.amount, 
      0
    );
    
    // Update payment status
    if (totalPaid >= invoice.total) {
      invoice.paymentStatus = "Paid";
      invoice.paymentDate = new Date();
    } else if (totalPaid > 0) {
      invoice.paymentStatus = "Partially Paid";
    }
    
    invoice.updatedBy = req.user.id;
    
    await invoice.save();
    
    res.status(200).json({ 
      message: "Payment recorded successfully", 
      invoice 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Don't delete paid invoices
    if (invoice.paymentStatus === "Paid") {
      return res.status(400).json({ 
        message: "Cannot delete a paid invoice" 
      });
    }
    
    await invoice.remove();
    
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get client invoice history
const getClientInvoices = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const invoices = await Invoice.find({ clientId })
      .sort({ date: -1 })
      .populate("items.service", "name");
    
    res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get pet invoice history
const getPetInvoices = async (req, res) => {
  try {
    const patientId = req.params.petId;
    
    const invoices = await Invoice.find({ patientId })
      .sort({ date: -1 })
      .populate("items.service", "name");
    
    res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  recordPayment,
  deleteInvoice,
  getClientInvoices,
  getPetInvoices
};