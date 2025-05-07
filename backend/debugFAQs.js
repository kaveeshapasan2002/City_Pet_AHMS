// debugFAQs.js - Run this with: node debugFAQs.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://your-connection-string';

// Import the models (adjust paths as needed)
require('./models/FAQ');
const FAQ = mongoose.model('FAQ');

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Debug function to list all FAQs
async function listAllFAQs() {
  try {
    console.log('\n--- All FAQs in Database ---');
    const faqs = await FAQ.find({}).sort({ category: 1, priority: -1 });
    
    if (faqs.length === 0) {
      console.log('No FAQs found in the database.');
      return;
    }
    
    console.log(`Found ${faqs.length} FAQs:\n`);
    
    // Group by category
    const byCategory = {};
    faqs.forEach(faq => {
      if (!byCategory[faq.category]) {
        byCategory[faq.category] = [];
      }
      byCategory[faq.category].push(faq);
    });
    
    // Print by category
    for (const [category, categoryFaqs] of Object.entries(byCategory)) {
      console.log(`\n=== Category: ${category} (${categoryFaqs.length} FAQs) ===`);
      
      categoryFaqs.forEach((faq, index) => {
        console.log(`\n[${index + 1}] ID: ${faq._id}`);
        console.log(`Question: ${faq.question}`);
        console.log(`Answer: ${faq.answer.substring(0, 100)}${faq.answer.length > 100 ? '...' : ''}`);
        console.log(`Keywords: ${faq.keywords ? faq.keywords.join(', ') : 'None'}`);
        console.log(`Priority: ${faq.priority}, Active: ${faq.isActive}`);
      });
    }
  } catch (error) {
    console.error('Error listing FAQs:', error);
  }
}

// Debug function to test FAQ matching
async function testFAQMatching(query) {
  try {
    console.log(`\n--- Testing FAQ matching for: "${query}" ---`);
    
    // Get all active FAQs
    const faqs = await FAQ.find({ isActive: true });
    
    if (faqs.length === 0) {
      console.log('No active FAQs found in the database.');
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Test keyword matching
    console.log('\n1. Testing keyword matching:');
    for (const faq of faqs) {
      if (faq.keywords && faq.keywords.length > 0) {
        for (const keyword of faq.keywords) {
          if (keyword && lowerQuery.includes(keyword.toLowerCase())) {
            console.log(`✅ MATCH found by keyword "${keyword}" for question: "${faq.question}"`);
          }
        }
      }
    }
    
    // Test phrase matching
    console.log('\n2. Testing phrase matching:');
    for (const faq of faqs) {
      if (faq.question) {
        const questionPhrases = faq.question.toLowerCase()
          .split(/[.,?!;]/)
          .map(phrase => phrase.trim())
          .filter(phrase => phrase.length > 5);
          
        for (const phrase of questionPhrases) {
          if (lowerQuery.includes(phrase)) {
            console.log(`✅ MATCH found by phrase "${phrase}" for question: "${faq.question}"`);
          }
        }
      }
    }
    
    // Test word overlap matching
    console.log('\n3. Testing word overlap matching:');
    for (const faq of faqs) {
      if (faq.question) {
        const questionWords = faq.question.toLowerCase().split(' ').filter(w => w.length > 3);
        
        // Count how many significant words match
        let matchCount = 0;
        const matchedWords = [];
        
        for (const word of questionWords) {
          if (lowerQuery.includes(word)) {
            matchCount++;
            matchedWords.push(word);
          }
        }
        
        // If more than 50% of significant words match, consider it a match
        if (questionWords.length > 0 && matchCount / questionWords.length > 0.5) {
          console.log(`✅ MATCH found by word overlap: ${matchCount}/${questionWords.length} words for question: "${faq.question}"`);
          console.log(`   Matched words: ${matchedWords.join(', ')}`);
        }
      }
    }
    
    // Test text search
    try {
      console.log('\n4. Testing text search:');
      const textSearchResults = await FAQ.find(
        { $text: { $search: query }, isActive: true },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(3);
      
      if (textSearchResults && textSearchResults.length > 0) {
        console.log(`✅ MATCH(ES) found by text search:`);
        textSearchResults.forEach((result, i) => {
          console.log(`   ${i+1}. "${result.question}" (score: ${result._doc.score.toFixed(2)})`);
        });
      } else {
        console.log('❌ No matches found by text search');
      }
    } catch (searchError) {
      console.log('❌ Text search unavailable:', searchError.message);
    }
    
  } catch (error) {
    console.error('Error testing FAQ matching:', error);
  }
}

// Function to create sample FAQs if none exist
async function createSampleFAQs() {
  try {
    const count = await FAQ.countDocuments();
    
    if (count === 0) {
      console.log('\n--- No FAQs found. Creating sample FAQs... ---');
      
      // Create a sample admin user ID (replace with a real user ID from your database)
      const adminId = mongoose.Types.ObjectId();
      
      const sampleFAQs = [
        {
          question: "What are your hospital hours?",
          answer: "Our hospital is open Monday to Friday from 8 AM to 8 PM, Saturday from 9 AM to 6 PM, and Sunday from 10 AM to 4 PM for emergencies only.",
          keywords: ["hours", "schedule", "timing", "open"],
          category: "hospital_info",
          priority: 10,
          isActive: true,
          createdBy: adminId
        },
        {
          question: "How do I schedule an appointment?",
          answer: "You can schedule an appointment through our website, mobile app, or by calling our reception at (555) 123-4567.",
          keywords: ["appointment", "schedule", "booking"],
          category: "appointments",
          priority: 9,
          isActive: true,
          createdBy: adminId
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash, credit cards, pet insurance, and offer CareCredit for financing. Payment is required at the time of service.",
          keywords: ["payment", "credit card", "insurance", "financing"],
          category: "payment",
          priority: 8,
          isActive: true,
          createdBy: adminId
        },
        {
          question: "What should I do in a pet emergency?",
          answer: "For emergencies during business hours, call our main line immediately. For after-hours emergencies, please call our emergency line at (555) 911-PETS. Always call ahead if possible so we can prepare for your arrival.",
          keywords: ["emergency", "urgent", "critical", "after hours"],
          category: "emergency",
          priority: 10,
          isActive: true,
          createdBy: adminId
        },
        {
          question: "Do you offer boarding services?",
          answer: "Yes, we offer boarding services with veterinary supervision. Pets must be up-to-date on vaccinations. Please book in advance as space is limited.",
          keywords: ["boarding", "kennel", "stay", "vacation"],
          category: "boarding",
          priority: 7,
          isActive: true,
          createdBy: adminId
        }
      ];
      
      await FAQ.insertMany(sampleFAQs);
      console.log(`Created ${sampleFAQs.length} sample FAQs`);
    }
  } catch (error) {
    console.error('Error creating sample FAQs:', error);
  }
}

// Main function
async function main() {
  try {
    // First, create sample FAQs if none exist
    await createSampleFAQs();
    
    // List all FAQs
    await listAllFAQs();
    
    // Test matching with sample queries
    const testQueries = [
      "What time are you open today?",
      "How can I book an appointment for my dog?",
      "Do you take credit cards?",
      "My cat is having trouble breathing, what should I do?",
      "Can I leave my pet while I'm on vacation?"
    ];
    
    for (const query of testQueries) {
      await testFAQMatching(query);
    }
    
    // Allow users to input their own test queries
    if (process.argv.length > 2) {
      const userQuery = process.argv.slice(2).join(' ');
      await testFAQMatching(userQuery);
    }
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the main function
main();