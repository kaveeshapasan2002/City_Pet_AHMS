// services/chatbotService.js
//chatbot service for processing mesages and generating responses
//this file contains the main logic for the chatbot
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

const mongoose = require('mongoose');
const FAQ = mongoose.model('FAQ');
const { OpenAI } = require('openai');

// Initialize DeepSeek API client (DeepSeek uses OpenAI-compatible API)
let deepseek;
try {
  deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "NOT_SET",
    baseURL: "https://api.deepseek.com"
  });
  
  // Debug log to verify the API key is loaded
  console.log('DEEPSEEK_API_KEY status:', process.env.DEEPSEEK_API_KEY ? 'Set' : 'Not set');
} catch (error) {
  console.error('Error initializing DeepSeek API client:', error);
}

// Warn if API key is not set
if (!process.env.DEEPSEEK_API_KEY) {
  console.warn('WARNING: DEEPSEEK_API_KEY is not set. AI chatbot will use fallback responses only.');
}

// Emergency classification levels with their symptoms
const emergencyKeywords = {
  critical: [
    'difficulty breathing', 'not breathing', 'choking', 'unconscious', 
    'collapsed', 'seizure', 'severe bleeding', 'hit by car', 'trauma', 
    'blue gums', 'bloated abdomen', 'unable to urinate'
  ],
  urgent: [
    'vomiting blood', 'bloody diarrhea', 'ingested poison', 'eye injury',
    'broken bone', 'open wound', 'high fever', 'severe pain', 'labor problems',
    'heat stroke', 'persistent vomiting', 'swollen abdomen'
  ],
  moderate: [
    'limping', 'mild bleeding', 'coughing', 'diarrhea', 'ear infection',
    'itching', 'not eating', 'mild vomiting', 'lethargy'
  ]
};

// Hospital information
const hospitalInfo = {
  name: 'PetCare Animal Hospital',
  address: '1234 Pet Care Lane, Animalville, AV 12345',
  phone: '(555) 123-4567',
  emergencyPhone: '(555) 911-PETS',
  hours: {
    monday: '8:00 AM - 8:00 PM',
    tuesday: '8:00 AM - 8:00 PM',
    wednesday: '8:00 AM - 8:00 PM',
    thursday: '8:00 AM - 8:00 PM',
    friday: '8:00 AM - 8:00 PM',
    saturday: '9:00 AM - 6:00 PM',
    sunday: '10:00 AM - 4:00 PM (Emergencies Only)'
  }
};

/**
 * Process a chatbot message and generate a response
 * @param {string} message - The user's message text
 * @param {string|null} userId - The user ID if authenticated
 * @param {string} sessionId - The chat session ID
 * @returns {Object} - Response object with message and metadata
 */
exports.processMessage = async (message, userId, sessionId) => {
  try {
    console.log(`Processing message: "${message}" from user ${userId || 'anonymous'}, session ${sessionId}`);
    
    // Check for emergency keywords
    const emergencyLevel = checkEmergencyLevel(message);
    
    // Determine response based on emergency level
    if (emergencyLevel) {
      console.log(`Detected emergency level: ${emergencyLevel}`);
      return generateEmergencyResponse(emergencyLevel);
    }
    
    // FIX: Add more detailed debugging for the FAQ matching process
    console.log(`Looking for matching FAQ for: "${message}"`);
    
    // Check for FAQ matches using a try-catch to prevent crashes
    let faqMatch = null;
    try {
      faqMatch = await findMatchingFAQ(message);
    } catch (faqError) {
      console.error('Error finding matching FAQ:', faqError);
      // Continue with null faqMatch
    }
    
    if (faqMatch) {
      console.log(`Found matching FAQ: ${faqMatch._id}, Question: "${faqMatch.question}"`);
      return {
        response: faqMatch.answer,
        emergencyLevel: 'none',
        intent: determineIntent(message, faqMatch.category),
        source: 'faq',
        faqId: faqMatch._id
      };
    } else {
      console.log(`No matching FAQ found for: "${message}"`);
    }
    
    // If no direct match found, try to use DeepSeek API for a more intelligent response
    if (deepseek && process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== "NOT_SET") {
      try {
        console.log('No FAQ match, attempting to use AI response');
        const aiResponse = await generateAIResponse(message);
        return {
          response: aiResponse,
          emergencyLevel: 'none',
          intent: 'general_question',
          source: 'ai'
        };
      } catch (error) {
        console.error('Error generating AI response:', error);
        // Fall back to a generic response if AI fails
      }
    }
    
    // Fall back to a generic response if AI is not available or fails
    console.log('Using fallback response');
    return generateFallbackResponse(message);
  } catch (error) {
    console.error('Error in processMessage:', error);
    return {
      response: `I'm having some trouble processing your message. Please try again or call our hospital at ${hospitalInfo.phone}.`,
      emergencyLevel: 'none',
      intent: 'error',
      source: 'error'
    };
  }
};

/**
 * Check for emergency keywords in the message
 * @param {string} message - The user's message
 * @returns {string|null} - Emergency level or null if not an emergency
 */
function checkEmergencyLevel(message) {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Check for critical emergencies first
    for (const keyword of emergencyKeywords.critical) {
      if (lowerMessage.includes(keyword)) {
        return 'critical';
      }
    }
    
    // Check for urgent emergencies
    for (const keyword of emergencyKeywords.urgent) {
      if (lowerMessage.includes(keyword)) {
        return 'urgent';
      }
    }
    
    // Check for moderate concerns
    for (const keyword of emergencyKeywords.moderate) {
      if (lowerMessage.includes(keyword)) {
        return 'moderate';
      }
    }
  } catch (error) {
    console.error('Error checking emergency level:', error);
  }
  
  return null;
}

/**
 * Generate emergency response based on severity
 * @param {string} level - Emergency level
 * @returns {Object} - Response object
 */
function generateEmergencyResponse(level) {
  try {
    switch (level) {
      case 'critical':
        return {
          response: `🚨 CRITICAL EMERGENCY: This appears to be a life-threatening situation. Please call our emergency line IMMEDIATELY at ${hospitalInfo.emergencyPhone} or proceed to our hospital at ${hospitalInfo.address}. While on your way:\n\n• Keep your pet as calm and still as possible\n• If bleeding, apply gentle pressure with a clean cloth\n• Do not give any food, water, or medication unless directed by a veterinarian`,
          emergencyLevel: 'critical',
          intent: 'emergency_help',
          contactInfo: {
            phone: hospitalInfo.emergencyPhone,
            address: hospitalInfo.address
          }
        };
      
      case 'urgent':
        return {
          response: `🚨 URGENT SITUATION: Your pet requires prompt veterinary attention. Please call us at ${hospitalInfo.emergencyPhone} to let us know you're coming in, or proceed directly to our hospital at ${hospitalInfo.address}. Our staff will prepare for your arrival.`,
          emergencyLevel: 'urgent',
          intent: 'emergency_help',
          contactInfo: {
            phone: hospitalInfo.emergencyPhone,
            address: hospitalInfo.address
          }
        };
      
      case 'moderate':
        return {
          response: `⚠️ MEDICAL CONCERN: This situation requires veterinary attention soon, but may not be immediately life-threatening. Please call us at ${hospitalInfo.phone} to schedule a same-day appointment. If symptoms worsen, please treat as an emergency.`,
          emergencyLevel: 'moderate',
          intent: 'emergency_help',
          contactInfo: {
            phone: hospitalInfo.phone,
            address: hospitalInfo.address
          }
        };
      
      default:
        return {
          response: `If you're concerned about your pet's health, please call us at ${hospitalInfo.phone} to schedule an appointment.`,
          emergencyLevel: 'none',
          intent: 'appointment_booking'
        };
    }
  } catch (error) {
    console.error('Error generating emergency response:', error);
    return {
      response: `If you're concerned about your pet's health, please call us at ${hospitalInfo.phone} immediately.`,
      emergencyLevel: 'none',
      intent: 'error'
    };
  }
}

/**
 * Find a matching FAQ for the user's query
 * @param {string} message - The user's message
 * @returns {Object|null} - Matching FAQ or null if no match
 */
async function findMatchingFAQ(message) {
  try {
    const lowerMessage = message.toLowerCase();
    
    // First check if any FAQs exist
    const faqCount = await FAQ.countDocuments({ isActive: true });
    console.log(`Found ${faqCount} active FAQs in database`);
    
    if (faqCount === 0) {
      console.log('No FAQs found in the database');
      return null;
    }
    
    // Get all active FAQs
    const faqs = await FAQ.find({ isActive: true });
    console.log(`Retrieved ${faqs.length} FAQs for matching`);
    
    // Check if faqs is valid array
    if (!Array.isArray(faqs) || faqs.length === 0) {
      console.log('No valid FAQs returned from database');
      return null;
    }
    
    // 1. First try keyword matching (most precise)
    for (const faq of faqs) {
      if (faq.keywords && Array.isArray(faq.keywords) && faq.keywords.length > 0) {
        for (const keyword of faq.keywords) {
          if (keyword && typeof keyword === 'string' && lowerMessage.includes(keyword.toLowerCase())) {
            console.log(`Matched FAQ by keyword: "${keyword}"`);
            return faq;
          }
        }
      }
    }
    
    // 2. Try exact phrase matching from the question
    for (const faq of faqs) {
      if (faq.question) {
        const questionPhrases = faq.question.toLowerCase()
          .split(/[.,?!;]/)
          .map(phrase => phrase.trim())
          .filter(phrase => phrase.length > 5);
          
        for (const phrase of questionPhrases) {
          if (lowerMessage.includes(phrase)) {
            console.log(`Matched FAQ by phrase: "${phrase}"`);
            return faq;
          }
        }
      }
    }
    
    // 3. Try partial question matching
    for (const faq of faqs) {
      if (faq.question) {
        const questionWords = faq.question.toLowerCase().split(' ').filter(w => w.length > 3);
        
        // Count how many significant words match
        let matchCount = 0;
        for (const word of questionWords) {
          if (lowerMessage.includes(word)) {
            matchCount++;
          }
        }
        
        // If more than 50% of significant words match, consider it a match
        if (questionWords.length > 0 && matchCount / questionWords.length > 0.5) {
          console.log(`Matched FAQ by word overlap: ${matchCount}/${questionWords.length} words`);
          return faq;
        }
      }
    }
    
    // 4. Try text search as last resort
    try {
      const textSearchResults = await FAQ.find(
        { $text: { $search: message }, isActive: true },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(1);
      
      if (textSearchResults && textSearchResults.length > 0) {
        console.log(`Matched FAQ by text search`);
        return textSearchResults[0];
      }
    } catch (searchError) {
      // Text search might not be available if the index isn't set up
      console.log('Text search unavailable:', searchError.message);
    }
    
    console.log('No matching FAQ found');
    return null;
  } catch (error) {
    console.error('Error finding matching FAQ:', error);
    return null;
  }
}

/**
 * Generate a response using DeepSeek API
 * @param {string} message - The user's message
 * @returns {string} - AI-generated response
 */
async function generateAIResponse(message) {
  try {
    // System context with information about the hospital
    const systemContext = `You are an AI assistant for ${hospitalInfo.name}, a veterinary hospital.
    
Current Date: ${new Date().toLocaleDateString()}
Hospital Address: ${hospitalInfo.address}
Phone: ${hospitalInfo.phone}
Emergency Phone: ${hospitalInfo.emergencyPhone}

Hours of Operation:
- Monday to Friday: ${hospitalInfo.hours.monday}
- Saturday: ${hospitalInfo.hours.saturday}
- Sunday: ${hospitalInfo.hours.sunday}

Your role is to provide helpful, accurate, and compassionate pet care information and assist with hospital-related inquiries.

1. Keep responses concise (max 3-4 sentences unless detailed information is requested)
2. Never diagnose medical conditions - always advise consulting a veterinarian for medical concerns
3. For any symptoms, recommend professional care
4. Be warm, empathetic, and reassuring when addressing pet health concerns
5. If you don't know an answer, say so rather than providing potentially incorrect information
6. Always include relevant hospital contact information when appropriate
7. When emergency concerns are mentioned, emphasize the importance of immediate veterinary care`;

    // Set up retry mechanism
    let response = null;
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts && !response) {
      try {
        console.log(`DeepSeek API attempt ${attempts + 1}`);
        // Call DeepSeek API
        const completion = await deepseek.chat.completions.create({
          model: "deepseek-chat", // Use the DeepSeek model
          messages: [
            { role: "system", content: systemContext },
            { role: "user", content: message }
          ],
          max_tokens: 300,
          temperature: 0.7
        });
        
        response = completion.choices[0].message.content.trim();
      } catch (apiError) {
        attempts++;
        console.error(`DeepSeek API attempt ${attempts} failed:`, apiError);
        
        if (attempts >= maxAttempts) {
          throw apiError; // Let the caller handle the error after max attempts
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return response || `I couldn't generate a specific response. Please contact our hospital at ${hospitalInfo.phone} for assistance.`;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Determine the intent of the message
 * @param {string} message - The user's message
 * @param {string} category - FAQ category if matched
 * @returns {string} - Intent classification
 */
function determineIntent(message, category) {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Map FAQ categories to intents
    if (category) {
      switch (category) {
        case 'hospital_info': return 'hospital_info';
        case 'services': return 'service_inquiry';
        case 'appointments': return 'appointment_booking';
        case 'payment': return 'pricing_inquiry';
        case 'pet_care': return 'pet_care_info';
        case 'emergency': return 'emergency_help';
        case 'medications': return 'pet_care_info';
        case 'boarding': return 'service_inquiry';
        default: return 'general_question';
      }
    }
    
    // Check for common intent keywords
    if (lowerMessage.includes('appoint') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return 'appointment_booking';
    }
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close') || lowerMessage.includes('locate')) {
      return 'hospital_info';
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee') || lowerMessage.includes('insur')) {
      return 'pricing_inquiry';
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide')) {
      return 'service_inquiry';
    }
    
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    
    // Default to general question if no specific intent detected
    return 'general_question';
  } catch (error) {
    console.error('Error determining intent:', error);
    return 'general_question';
  }
}

/**
 * Generate a fallback response when no specific match is found
 * @param {string} message - The user's message
 * @returns {Object} - Response object
 */
function generateFallbackResponse(message) {
  try {
    const intent = determineIntent(message);
    
    let response;
    
    switch (intent) {
      case 'greeting':
        response = `Hello! Welcome to ${hospitalInfo.name} chat assistant. How can I help you today? You can ask about our services, hours, appointment scheduling, or any pet health concerns.`;
        break;
      
      case 'hospital_info':
        response = `${hospitalInfo.name} is located at ${hospitalInfo.address}. Our hours are: Monday-Friday: 8AM-8PM, Saturday: 9AM-6PM, and Sunday: 10AM-4PM (emergencies only). For appointments, call us at ${hospitalInfo.phone}.`;
        break;
      
      case 'appointment_booking':
        response = `To schedule an appointment, please call us at ${hospitalInfo.phone} or use our online booking system on our website. Please let us know what type of appointment you need.`;
        break;
      
      case 'pricing_inquiry':
        response = `Our pricing varies depending on the specific services needed. We accept most major pet insurance plans and offer CareCredit financing. For specific pricing information, please call us at ${hospitalInfo.phone}.`;
        break;
      
      case 'service_inquiry':
        response = `We offer a comprehensive range of veterinary services including wellness exams, vaccinations, surgery, dental care, emergency treatment, grooming, and boarding. Would you like more information about any specific service?`;
        break;
      
      default:
        response = `I don't have a specific answer for that question. You can call us at ${hospitalInfo.phone} for more information, or ask me about our hours, services, appointment scheduling, or pet health concerns.`;
    }
    
    return {
      response,
      emergencyLevel: 'none',
      intent,
      isGenerated: true
    };
  } catch (error) {
    console.error('Error generating fallback response:', error);
    return {
      response: `I'm having some trouble processing your message. Please call us at ${hospitalInfo.phone} for assistance.`,
      emergencyLevel: 'none',
      intent: 'error',
      isGenerated: true
    };
  }
}

/**
 * Process feedback on a chatbot response
 * @param {string} messageId - ID of the chat message
 * @param {number} rating - Feedback rating (1-5)
 * @param {string} comment - Optional feedback comment
 * @returns {boolean} - Success status
 */
exports.processFeedback = async (messageId, rating, comment) => {
  try {
    console.log(`Processing feedback for message ${messageId}: rating=${rating}, comment="${comment || 'none'}"`);
    
    const ChatLog = mongoose.model('ChatLog');
    await ChatLog.findByIdAndUpdate(messageId, {
      feedbackRating: rating,
      feedbackComment: comment
    });
    
    // Log feedback for future improvement of FAQs
    if (rating <= 2) {
      console.log(`Low rating (${rating}) received for message ${messageId}. Review may be needed.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error processing feedback:', error);
    return false;
  }
};