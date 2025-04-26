// utils/smsService.js
const twilio = require('twilio');

// Initialize Twilio client with credentials from environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS message using Twilio
 * 
 * @param {string} to - Recipient phone number (format: +1234567890)
 * @param {string} body - Message content
 * @returns {Promise} - Resolves when SMS is sent
 */
const sendSMS = async (to, body) => {
  try {
    // Format phone number to E.164 standard if not already formatted
    const formattedNumber = formatPhoneNumber(to);
    
    // Send message through Twilio
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });
    
    console.log(`✅ SMS sent to ${formattedNumber} (${message.sid})`);
    return message;
  } catch (error) {
    console.error(`❌ SMS sending failed: ${error.message}`);
    throw error;
  }
};

/**
 * Format phone number to E.164 standard (+1234567890)
 * 
 * @param {string} phoneNumber - Input phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Check if number already has a country code (assuming starts with +)
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Add US country code (+1) by default if 10 digits
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // Otherwise just add + prefix
  return `+${digits}`;
};

module.exports = {
  sendSMS
};