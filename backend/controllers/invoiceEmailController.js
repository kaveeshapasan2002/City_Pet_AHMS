// controllers/invoiceEmailController.js
const Invoice = require("../models/InvoiceModel");
const { sendInvoiceEmail } = require("../utils/invoiceEmailService");

/**
 * Send invoice via email
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const emailInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find invoice and populate all related data
    const invoice = await Invoice.findById(id)
      .populate("clientId", "name email phonenumber")
      .populate("items.service")
      .populate("createdBy", "name");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    // Check if user has permission to access this invoice
    // Here you can add more specific permission checks if needed
    // For example, admins can email any invoice, but regular users only their own
    // This is just a basic example
    // if (req.user.role !== 'admin' && req.user.role !== 'staff' && 
    //     invoice.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized to email this invoice" });
    // }
    
    // Send email
    const emailResult = await sendInvoiceEmail(invoice);
    
    // Log the email action
    console.log(`Invoice #${invoice.invoiceNumber} emailed by user ${req.user.id} to ${invoice.clientEmail}`);
    
    res.status(200).json({ 
      message: "Invoice email sent successfully", 
      emailId: emailResult.messageId 
    });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    res.status(500).json({ message: "Failed to send invoice email", error: error.message });
  }
};

module.exports = {
  emailInvoice
};