// src/pages/Messaging.js
import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessagingProvider, useMessaging } from '../context/MessagingContext';
import ConversationList from '../components/messaging/ConversationList';
import EnhancedConversationView from '../components/messaging/EnhancedConversationView';
import UserDirectory from '../components/messaging/UserDirectory';
import ConversationLoader from '../components/messaging/ConversationLoader';
import { FaPlus } from 'react-icons/fa';

// Inner component that uses the messaging context
const MessagingContent = () => {
  const { loadConversation, activeConversation, clearActiveConversation } = useMessaging();
  const [showUserDirectory, setShowUserDirectory] = useState(false);
  const { id } = useParams(); // Get conversation ID from URL if present
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    loadConversation(conversation._id);
  };
  
  // Handle new conversation start
  const handleStartConversation = (conversation) => {
    setShowUserDirectory(false);
    loadConversation(conversation._id);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Automatically load conversation from URL parameter */}
      {id && <ConversationLoader />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowUserDirectory(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            New Message
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations panel */}
        <div className="md:col-span-1">
          <ConversationList 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
        
        {/* Conversation view panel */}
        <div className="md:col-span-2 h-[calc(100vh-200px)]">
          <EnhancedConversationView conversation={activeConversation} />
        </div>
      </div>
      
      {/* User directory modal */}
      {showUserDirectory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <UserDirectory 
            onStartConversation={handleStartConversation} 
            onClose={() => setShowUserDirectory(false)} 
          />
        </div>
      )}
    </div>
  );
};

// Main component with provider
const Messaging = () => {
  const { isAuth } = useAuth();
  
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  return (
    <MessagingProvider>
      <MessagingContent />
    </MessagingProvider>
  );
};

export default Messaging;