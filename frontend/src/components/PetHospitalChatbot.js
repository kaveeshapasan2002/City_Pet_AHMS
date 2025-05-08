//component to create a chatbot for a pet hospital
// PetHospitalChatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPaw, FaPhone, FaAmbulance, FaHospital, FaComments } from 'react-icons/fa';
import { TiMessages } from 'react-icons/ti';

// Hospital information as a backup for when the API fails
const hospitalInfo = {
  name: 'PetCare Animal Hospital',
  address: ' No:137/1 කඩුවෙල පාර, 10150',
  phone: '0754086545',
  emergencyPhone: '(555) 911-PETS',
  hours: {
    weekdays: '8:00 AM - 8:00 PM',
    saturday: '9:00 AM - 6:00 PM',
    sunday: '10:00 AM - 4:00 PM (Emergencies Only)'
  }
};

// Create an axios instance with default settings
const apiClient = axios.create({
  baseURL: 'http://localhost:5001', // Make sure this matches your backend URL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const PetHospitalChatbot = () => {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-message',
      text: "Hello! I'm your PetCare Assistant. How can I help you today?",
      sender: 'bot',
      time: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [showConnectionError, setShowConnectionError] = useState(false);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Set auth token for API requests when user changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (user && user.token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [user]);
  
  // First fetch - check if API is available
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiClient.get('/api/chatbot/test');
        console.log('API Status:', response.data);
      } catch (error) {
        console.warn('API Status Check Failed:', error.message);
      }
    };
    
    checkApiStatus();
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Add a bot message to the chat
  const addBotMessage = (text, emergencyLevel = 'none', source = null) => {
    const botMessage = {
      id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text,
      sender: 'bot',
      time: new Date(),
      emergencyLevel,
      source
    };
    
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Get fallback response based on message content
  const getFallbackResponse = (userMessageText) => {
    const lowerMessage = userMessageText.toLowerCase();
    
    // Pet health concerns with specific fallbacks
    if (lowerMessage.includes('cough') || lowerMessage.includes('coughing')) {
      return `Coughing in dogs can be caused by respiratory infections, heart problems, tracheal issues, or foreign objects. If your dog has been coughing persistently, please call us at ${hospitalInfo.phone} to schedule an examination. Restrict exercise and monitor for any breathing difficulties which would require immediate attention.`;
    }
    else if (lowerMessage.includes('vomit') || lowerMessage.includes('throw up')) {
      return `Vomiting can be caused by many factors from dietary indiscretion to more serious conditions. If your pet has vomited more than twice in 24 hours, contains blood, or seems lethargic, please call us at ${hospitalInfo.phone} to schedule an urgent appointment. In the meantime, withhold food for a few hours but ensure fresh water is available.`;
    }
    
    // Check for common patterns and provide appropriate responses
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      return `To schedule an appointment, please call us at ${hospitalInfo.phone} during our business hours: weekdays ${hospitalInfo.hours.weekdays}, Saturday ${hospitalInfo.hours.saturday}, and Sunday ${hospitalInfo.hours.sunday}.`;
    } 
    else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return `Our hours are: Monday-Friday: ${hospitalInfo.hours.weekdays}, Saturday: ${hospitalInfo.hours.saturday}, and Sunday: ${hospitalInfo.hours.sunday}.`;
    }
    else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
      return `We offer a comprehensive range of veterinary services including wellness exams, vaccinations, surgery, dental care, emergency treatment, grooming, and boarding. For more specific information, please call us at ${hospitalInfo.phone}.`;
    }
    else if (lowerMessage.includes('emergency')) {
      return `For pet emergencies, please call our emergency line at ${hospitalInfo.emergencyPhone} or proceed directly to our hospital at ${hospitalInfo.address}. We're equipped to handle urgent situations 24/7.`;
    }
    
    // Default fallback
    return `I'm sorry, I'm having trouble connecting to our systems. Please try again later or call us directly at ${hospitalInfo.phone}.`;
  };
  
  // Handle sending a message with retry logic
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Generate a unique ID for this message
    const messageId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Add user message to chat
    const userMessage = {
      id: messageId,
      text: inputMessage,
      sender: 'user',
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Store the current message for use in error handling
    const currentMessageText = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    
    try {
      // First attempt
      console.log('Attempting first API call to /api/chatbot/message');
      
      const response = await apiClient.post('/api/chatbot/message', {
        message: currentMessageText,
        userId: user?.id || null,
        sessionId: sessionId
      });
      
      console.log('API response:', response);
      setShowConnectionError(false);
      
      // Delay to simulate thinking (even if we got a response quickly)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setIsTyping(false);
      
      // Add response from the API to the chat
      if (response?.data && response.data.response) {
        const botMessage = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          text: response.data.response,
          sender: 'bot',
          time: new Date(),
          emergencyLevel: response.data.emergencyLevel || 'none',
          // Add source and faqId if available from response
          source: response.data.source || null,
          faqId: response.data.faqId || null
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // If it's an emergency, add an additional prompt
        if (response.data.emergencyLevel && 
           (response.data.emergencyLevel === 'critical' || 
            response.data.emergencyLevel === 'urgent')) {
          
          setTimeout(() => {
            const followUpMessage = {
              id: `bot-emergency-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              text: 'Would you like me to connect you with our emergency line? Or I can provide our location for quickest arrival.',
              sender: 'bot',
              time: new Date()
            };
            setMessages(prev => [...prev, followUpMessage]);
          }, 1000);
        }
      } else {
        // Fallback if API call succeeds but response format is unexpected
        const fallbackResponse = getFallbackResponse(currentMessageText);
        addBotMessage(fallbackResponse, 'none', 'fallback');
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      setIsTyping(false);
      
      // Specifically handle 500 internal server errors
      if (error.response && error.response.status === 500) {
        console.log('Server returned 500 error - using local fallback');
        
        // Show connection error notification
        setShowConnectionError(true);
        
        // Use the appropriate fallback response based on message content
        const fallbackResponse = getFallbackResponse(currentMessageText);
        addBotMessage(fallbackResponse, 'none', 'error');
      } else {
        // For other errors, try a second attempt
        try {
          console.log('Attempting second API call to /api/chatbot/message');
          
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const retryResponse = await apiClient.post('/api/chatbot/message', {
            message: currentMessageText,
            userId: user?.id || null,
            sessionId: sessionId
          });
          
          console.log('Second API call succeeded:', retryResponse);
          setShowConnectionError(false);
          
          // Add response from the retry
          if (retryResponse?.data && retryResponse.data.response) {
            setIsTyping(false);
            
            const botMessage = {
              id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              text: retryResponse.data.response,
              sender: 'bot',
              time: new Date(),
              emergencyLevel: retryResponse.data.emergencyLevel || 'none',
              source: retryResponse.data.source || null,
              faqId: retryResponse.data.faqId || null
            };
            
            setMessages(prev => [...prev, botMessage]);
          } else {
            // Fallback if retry succeeds but response format is unexpected
            const fallbackResponse = getFallbackResponse(currentMessageText);
            addBotMessage(fallbackResponse, 'none', 'fallback');
          }
        } catch (retryError) {
          console.error('Second API call also failed:', retryError);
          
          // Show connection error notification
          setShowConnectionError(true);
          
          // Use intelligent fallback based on message content
          const fallbackResponse = getFallbackResponse(currentMessageText);
          addBotMessage(fallbackResponse, 'none', 'error');
        }
      }
    }
  };
  
  // Get preset messages for quick actions
  const getPresetMessage = (type) => {
    switch(type) {
      case 'hours':
        return "What are your hours?";
      case 'appointment':
        return "How do I make an appointment?";
      case 'services':
        return "What services do you offer?";
      case 'emergency':
        return "Emergency help";
      default:
        return "";
    }
  };
  
  // Handle preset button click
  const handlePresetClick = (type) => {
    const message = getPresetMessage(type);
    setInputMessage(message);
    // Small delay to allow state update
    setTimeout(() => {
      handleSendMessage();
    }, 10);
  };
  
  // Format timestamp for messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chat Icon */}
      <div 
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 cursor-pointer transform transition-all duration-300 hover:scale-110 ${isChatOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? 
          <FaComments className="text-white text-2xl" /> : 
          <TiMessages className="text-white text-2xl animate-pulse" />
        }
      </div>
      
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-96 max-w-full bg-white rounded-xl shadow-2xl overflow-hidden z-40 transition-all duration-300 transform ${
          isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        } border border-gray-200`}
      >
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaPaw className="mr-2" />
            <h3 className="font-semibold">PetCare Assistant</h3>
          </div>
          <div className="flex space-x-3">
            <a href={`tel:${hospitalInfo.phone.replace(/[^0-9]/g, '')}`}>
              <FaPhone className="cursor-pointer hover:text-blue-200" title="Call Clinic" />
            </a>
            <a href={`tel:${hospitalInfo.emergencyPhone.replace(/[^0-9]/g, '')}`}>
              <FaAmbulance className="cursor-pointer hover:text-blue-200" title="Emergency" />
            </a>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(hospitalInfo.address)}`} target="_blank" rel="noopener noreferrer">
              <FaHospital className="cursor-pointer hover:text-blue-200" title="Directions" />
            </a>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : message.source === 'faq' 
                    ? 'bg-green-100 text-gray-800 rounded-bl-none' // Highlight FAQ responses
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text.startsWith('🚨') || message.emergencyLevel === 'critical' || message.emergencyLevel === 'urgent' ? (
                  <div className="font-bold text-red-500 bg-white p-2 rounded-md">
                    {message.text}
                  </div>
                ) : (
                  message.text
                )}
                <div 
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.time)}
                  {/* Display source information if available */}
                  {message.source && (
                    <span className="ml-2">
                      {message.source === 'faq' ? '(From FAQ)' : 
                       message.source === 'ai' ? '(AI Generated)' : 
                       ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
        
        {/* Quick Action Buttons */}
        <div className="px-3 pb-3 flex space-x-2">
          <button 
            onClick={() => handlePresetClick('hours')} 
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
          >
            Hours
          </button>
          <button 
            onClick={() => handlePresetClick('appointment')}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
          >
            Appointment
          </button>
          <button 
            onClick={() => handlePresetClick('services')}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
          >
            Services
          </button>
          <button 
            onClick={() => handlePresetClick('emergency')}
            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-red-200"
          >
            Emergency
          </button>
        </div>
      </div>
      
      {/* Connection Error Notification */}
      {showConnectionError && (
        <div className="fixed bottom-24 right-6 mb-2 bg-red-100 text-red-700 p-3 rounded-lg shadow-md z-50 animate-bounce">
          <p className="font-semibold">Connection issues detected</p>
          <p className="text-sm">Our chat system is experiencing difficulties. For immediate assistance, please call {hospitalInfo.phone}.</p>
          <button 
            onClick={() => setShowConnectionError(false)} 
            className="mt-2 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Add debugging panel for development environment */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-6 right-6 bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-md z-50" style={{ maxWidth: '300px', display: 'none' }}>
          <h4 className="font-bold">Debug Info</h4>
          <p className="text-xs">Session ID: {sessionId}</p>
          <p className="text-xs">API URL: {apiClient.defaults.baseURL}</p>
          <p className="text-xs">Auth: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
          <button 
            onClick={() => console.log('Messages:', messages)}
            className="text-xs bg-gray-700 px-2 py-1 rounded mt-2"
          >
            Log Messages
          </button>
          <button 
            onClick={() => apiClient.get('/api/chatbot/test-db')}
            className="text-xs bg-gray-700 px-2 py-1 rounded mt-2 ml-2"
          >
            Test DB
          </button>
        </div>
      )}
      
      <style jsx="true">{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #9ca3af;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s ease-in-out infinite;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% {
            transform: translateY(0px);
            background-color: #9ca3af;
          }
          50% {
            transform: translateY(-5px);
            background-color: #6b7280;
          }
          100% {
            transform: translateY(0px);
            background-color: #9ca3af;
          }
        }
      `}</style>
    </>
  );
};

export default PetHospitalChatbot;