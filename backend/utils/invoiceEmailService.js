// utils/invoiceEmailService.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

/**
 * Send invoice email to client
 * 
 * @param {Object} invoice - The invoice object with all details
 * @returns {Promise} - Resolves when email is sent
 */
const sendInvoiceEmail = async (invoice) => {
    try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Format dates and numbers
        const formattedDate = new Date(invoice.date).toLocaleDateString();
        const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString();
        const formattedTotal = invoice.total.toFixed(2);
        
        // Calculate total paid and remaining balance
        const totalPaid = invoice.paymentHistory?.reduce(
            (sum, payment) => sum + payment.amount, 
            0
        ) || 0;
        const remainingBalance = (invoice.total - totalPaid).toFixed(2);

        // Build HTML for invoice items
        let itemsHtml = '';
        invoice.items.forEach(item => {
            itemsHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-weight: 500;">${item.service?.name || 'Custom Service'}</div>
                    <div style="font-size: 14px; color: #6b7280;">${item.description || ''}</div>
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.amount.toFixed(2)}</td>
            </tr>`;
        });
        
        // Build HTML for payment history if any
        let paymentHistoryHtml = '';
        if (invoice.paymentHistory && invoice.paymentHistory.length > 0) {
            paymentHistoryHtml = `
            <h3 style="margin-top: 20px; margin-bottom: 10px;">Payment History:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f3f4f6;">
                        <th style="padding: 8px; text-align: left;">Date</th>
                        <th style="padding: 8px; text-align: left;">Method</th>
                        <th style="padding: 8px; text-align: left;">Reference</th>
                        <th style="padding: 8px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>`;
                
            invoice.paymentHistory.forEach(payment => {
                const paymentDate = new Date(payment.date).toLocaleDateString();
                paymentHistoryHtml += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${paymentDate}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${payment.method}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${payment.reference || '-'}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${payment.amount.toFixed(2)}</td>
                </tr>`;
            });
            
            paymentHistoryHtml += `
                </tbody>
            </table>`;
        }

        // Prepare email subject and content
        const subject = `Invoice #${invoice.invoiceNumber} from City Animal Hospital`;
        
        // Plain text version
        const text = `
            Invoice #${invoice.invoiceNumber}
            
            Date: ${formattedDate}
            Due Date: ${formattedDueDate}
            
            Bill To:
            ${invoice.clientName}
            ${invoice.clientEmail}
            ${invoice.clientContact}
            
            Patient Information:
            Name: ${invoice.patientName}
            ID: ${invoice.patientId}
            
            Total Amount: $${formattedTotal}
            Payment Status: ${invoice.paymentStatus}
            
            Please log in to your account to view the full invoice details.
            
            Thank you for choosing City Animal Hospital for your pet's healthcare needs.
        `;
        
        // HTML version
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">City Animal Hospital</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <div>
                        <h2 style="margin-top: 0; margin-bottom: 10px;">Invoice #${invoice.invoiceNumber}</h2>
                        <div style="color: ${
                            invoice.paymentStatus === 'Paid' 
                                ? '#16a34a' 
                                : invoice.paymentStatus === 'Partially Paid'
                                ? '#ca8a04' 
                                : '#dc2626'
                        }; font-weight: bold; margin-bottom: 10px;">
                            ${invoice.paymentStatus}
                        </div>
                    </div>
                    
                    <div style="text-align: right;">
                        <div style="margin-bottom: 5px;"><strong>Date:</strong> ${formattedDate}</div>
                        <div><strong>Due Date:</strong> ${formattedDueDate}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <div style="width: 48%;">
                        <h3 style="margin-top: 0; margin-bottom: 10px;">Bill To:</h3>
                        <div style="font-weight: 500;">${invoice.clientName}</div>
                        <div>${invoice.clientEmail}</div>
                        <div>${invoice.clientContact}</div>
                    </div>
                    
                    <div style="width: 48%;">
                        <h3 style="margin-top: 0; margin-bottom: 10px;">Patient Information:</h3>
                        <div><strong>Name:</strong> ${invoice.patientName}</div>
                        <div><strong>ID:</strong> ${invoice.patientId}</div>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px; margin-bottom: 10px;">Invoice Items:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="padding: 8px; text-align: left;">Description</th>
                            <th style="padding: 8px; text-align: right;">Qty</th>
                            <th style="padding: 8px; text-align: right;">Unit Price</th>
                            <th style="padding: 8px; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="margin-left: auto; width: 250px;">
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Subtotal:</span>
                        <span>$${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Tax (${invoice.taxRate}%):</span>
                        <span>$${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    
                    ${invoice.discountAmount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Discount:</span>
                        <span>-$${invoice.discountAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; font-weight: bold; border-top: 1px solid #e5e7eb; margin-top: 5px;">
                        <span>Total:</span>
                        <span>$${formattedTotal}</span>
                    </div>
                    
                    ${totalPaid > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; margin-top: 5px;">
                        <span>Amount Paid:</span>
                        <span style="color: #16a34a;">$${totalPaid.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${remainingBalance > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: 600;">
                        <span>Balance Due:</span>
                        <span style="color: #dc2626;">$${remainingBalance}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${paymentHistoryHtml}
                
                ${invoice.notes ? `
                <div style="margin-top: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 10px;">Notes:</h3>
                    <p style="color: #4b5563;">${invoice.notes}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #6b7280;">
                    <p>Thank you for choosing City Animal Hospital for your pet's healthcare needs.</p>
                    <p>If you have any questions about this invoice, please contact us at info@petcity.lk or +94 11 2345678.</p>
                </div>
            </div>
        </div>
        `;

        // Configure email options
        const mailOptions = {
            from: `City Animal Hospital <${process.env.EMAIL_USER}>`,
            to: invoice.clientEmail,
            subject,
            text,
            html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Invoice email sent to ${invoice.clientEmail} (${info.messageId})`);
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error("❌ Invoice email sending failed:", error);
        throw error;
    }
};

module.exports = {
    sendInvoiceEmail
};