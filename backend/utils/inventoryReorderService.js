// backend/utils/inventoryReorderService.js

const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');
const PurchaseRequest = require('../models/PurchaseRequest');
const { sendEmail } = require('./emailService');

/**
 * Service for handling automated inventory reordering
 */
class InventoryReorderService {
  /**
   * Get all inventory items that are below their low stock threshold
   * 
   * @returns {Promise<Array>} Array of low stock inventory items
   */
  async getLowStockItems() {
    try {
      // Get all active inventory items
      const allItems = await Inventory.find({ isActive: true });
      
      // Filter to only items that are below or at their low stock threshold
      const lowStockItems = allItems.filter(item => {
        return item.quantity <= item.lowStockThreshold;
      });
      
      return lowStockItems;
    } catch (error) {
      console.error('Error getting low stock items:', error);
      throw error;
    }
  }

  /**
   * Get suppliers matching the category of an inventory item
   * 
   * @param {String} category - Category to match suppliers
   * @returns {Promise<Array>} Array of matching suppliers
   */
  async getSuppliersByCategory(category) {
    try {
      console.log(`Looking for suppliers in category: ${category}`);
      
      // Log all available suppliers to help debug
      const allSuppliers = await Supplier.find({ isActive: true });
      console.log(`Total active suppliers in database: ${allSuppliers.length}`);
      console.log(`Available supplier categories: ${allSuppliers.map(s => s.category).join(', ')}`);
      
      // Find suppliers matching the category
      const suppliers = await Supplier.find({
        category: category,
        isActive: true
      });
      
      console.log(`Found ${suppliers.length} suppliers for category ${category}`);
      
      if (suppliers.length === 0) {
        // Try case-insensitive search as a fallback
        const suppliersInsensitive = await Supplier.find({
          category: { $regex: new RegExp(category, "i") },
          isActive: true
        });
        
        console.log(`Case-insensitive search found ${suppliersInsensitive.length} suppliers for category ${category}`);
        
        if (suppliersInsensitive.length > 0) {
          console.log(`Using case-insensitive results instead. First supplier: ${suppliersInsensitive[0].name} (${suppliersInsensitive[0].email})`);
        }
        
        return suppliersInsensitive;
      }
      
      return suppliers;
    } catch (error) {
      console.error(`Error finding suppliers for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Create a purchase request for a low stock item
   * 
   * @param {Object} item - Inventory item
   * @param {ObjectId} userId - User ID creating the request
   * @returns {Promise<Object>} Created purchase request
   */
  async createPurchaseRequest(item, userId) {
    try {
      // Calculate suggested order quantity (Twice the low stock threshold)
      const suggestedQuantity = item.lowStockThreshold * 2;
      
      // Calculate total amount
      const totalAmount = suggestedQuantity * item.unitPrice;
      
      // Create purchase request
      const purchaseRequest = await PurchaseRequest.create({
        item: item._id,
        itemName: item.name,
        category: item.category,
        quantity: suggestedQuantity,
        unitPrice: item.unitPrice,
        totalAmount: totalAmount,
        requestedBy: userId,
        status: 'Pending',
        requestNotes: `Auto-generated request for low stock item (${item.quantity} remaining)`,
        createdBy: userId,
        updatedBy: userId
      });
      
      return purchaseRequest;
    } catch (error) {
      console.error('Error creating purchase request:', error);
      throw error;
    }
  }

  /**
   * Send reorder emails to suppliers for low stock items
   * 
   * @param {Array} lowStockItems - Array of low stock inventory items
   * @returns {Promise<Array>} Array of email sending results
   */
  async sendReorderEmails(lowStockItems) {
    try {
      const emailResults = [];
      
      // Group items by category for more efficient processing
      const itemsByCategory = {};
      lowStockItems.forEach(item => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
      });

      console.log("Items grouped by category:", Object.keys(itemsByCategory));
      
      // For each category, find suppliers and send emails
      for (const category in itemsByCategory) {
        const suppliers = await this.getSuppliersByCategory(category);
        
        console.log(`Category ${category}: Found ${suppliers.length} suppliers`);
        
        // Skip if no suppliers found for this category
        if (suppliers.length === 0) {
          console.warn(`No suppliers found for category: ${category}. Skipping email sending for these items.`);
          continue;
        }
        
        // For each supplier in this category, send an email with the low stock items
        for (const supplier of suppliers) {
          console.log(`Preparing email for supplier: ${supplier.name} (${supplier.email})`);
          
          // Validate supplier email
          if (!supplier.email || !supplier.email.includes('@')) {
            console.error(`Invalid email address for supplier ${supplier.name}: ${supplier.email}`);
            emailResults.push({
              supplier: supplier.name,
              email: supplier.email || 'missing',
              success: false,
              error: 'Invalid email address'
            });
            continue;
          }
          
          // Create HTML table of items
          const itemsTable = this.createItemsTable(itemsByCategory[category]);
          
          // Send email to supplier
          const emailSubject = `Low Stock Alert - Reorder Request for ${category} Items`;
          const emailText = `
            Hello ${supplier.contactPerson},
            
            We're running low on the following items in our inventory. Please provide a quote for these items at your earliest convenience.
            
            ${itemsByCategory[category].map(item => 
              `- ${item.name}: ${item.quantity} ${item.unit} remaining (below threshold of ${item.lowStockThreshold})`
            ).join('\n')}
            
            Thank you for your prompt attention to this request.
            
            Regards,
            Pet Hospital Team
          `;
          
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
                <h1>Low Stock Alert - Reorder Request</h1>
              </div>
              <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                <p>Hello ${supplier.contactPerson},</p>
                <p>We're running low on the following items in our inventory. Please provide a quote for these items at your earliest convenience.</p>
                
                ${itemsTable}
                
                <p>Thank you for your prompt attention to this request.</p>
                <p>Regards,<br>Pet Hospital Team</p>
              </div>
            </div>
          `;
          
          try {
            console.log(`Attempting to send email to ${supplier.email}...`);
            
            // Send the email
            const emailResult = await sendEmail(supplier.email, emailSubject, emailText, emailHtml);
            console.log(`Email sent successfully to ${supplier.email}`);
            
            emailResults.push({
              supplier: supplier.name,
              email: supplier.email,
              success: true,
              messageId: emailResult.messageId
            });
          } catch (error) {
            console.error(`Error sending email to supplier ${supplier.name} (${supplier.email}):`, error);
            emailResults.push({
              supplier: supplier.name,
              email: supplier.email,
              success: false,
              error: error.message
            });
          }
        }
      }
      
      // Log the final results
      const successfulEmails = emailResults.filter(result => result.success).length;
      console.log(`Email sending completed. ${successfulEmails} emails sent successfully out of ${emailResults.length} attempts.`);
      
      return emailResults;
    } catch (error) {
      console.error('Error sending reorder emails:', error);
      throw error;
    }
  }

  /**
   * Create HTML table for email with inventory items
   * 
   * @param {Array} items - Array of inventory items
   * @returns {String} HTML table string
   */
  createItemsTable(items) {
    return `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Item Name</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Current Quantity</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Unit</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Low Stock Threshold</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Suggested Order</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.unit}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.lowStockThreshold}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.lowStockThreshold * 2}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Process auto reorder for all low stock items
   * 
   * @param {ObjectId} userId - User ID initiating the reorder
   * @returns {Promise<Object>} Results of the reorder process
   */
  async processAutoReorder(userId) {
    try {
      // Get all low stock items
      const lowStockItems = await this.getLowStockItems();
      
      // If no low stock items, return early
      if (lowStockItems.length === 0) {
        return {
          success: true,
          message: 'No low stock items found that require reordering.',
          itemsProcessed: 0,
          emailsSent: 0
        };
      }
      
      // Create purchase requests for each item
      const purchaseRequests = [];
      for (const item of lowStockItems) {
        const request = await this.createPurchaseRequest(item, userId);
        purchaseRequests.push(request);
      }
      
      // Send emails to suppliers
      const emailResults = await this.sendReorderEmails(lowStockItems);
      
      // Calculate summary statistics
      const successfulEmails = emailResults.filter(result => result.success).length;
      
      return {
        success: true,
        message: `Successfully processed ${lowStockItems.length} low stock items and sent ${successfulEmails} supplier emails.`,
        itemsProcessed: lowStockItems.length,
        emailsSent: successfulEmails,
        purchaseRequests: purchaseRequests,
        emailResults: emailResults
      };
    } catch (error) {
      console.error('Error processing auto reorder:', error);
      return {
        success: false,
        message: `Error processing auto reorder: ${error.message}`,
        error: error
      };
    }
  }
}

module.exports = new InventoryReorderService();