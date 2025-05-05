// src/pages/Messaging.js
import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessagingProvider, useMessaging } from '../context/MessagingContext';
import ConversationList from '../components/messaging/ConversationList';
import ConversationView from '../components/messaging/ConversationView';
import UserDirectory from '../components/messaging/UserDirectory';
import ConversationLoader from '../components/messaging/ConversationLoader';
import { FaPlus } from 'react-icons/fa';

// Inner component that uses the messaging context
const MessagingContent = () => {
  const { loadConversation, activeConversation, clearActiveConversation } = useMessaging();
  const [showUserDirectory, setShowUserDirectory] = useState(false);
  const { id } = useParams(); // Get conversation ID from URL if present
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  
  // Handle window resize to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // In mobile mode, if a conversation is active, hide the list
      if (mobile && activeConversation) {
        setShowConversationList(false);
      } else {
        setShowConversationList(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeConversation]);
  
  // When a conversation becomes active in mobile, hide the list
  useEffect(() => {
    if (isMobile && activeConversation) {
      setShowConversationList(false);
    }
  }, [activeConversation, isMobile]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    loadConversation(conversation._id);
    
    // In mobile view, hide the conversation list
    if (isMobile) {
      setShowConversationList(false);
    }
  };
  
  // Handle new conversation start
  const handleStartConversation = (conversation) => {
    setShowUserDirectory(false);
    loadConversation(conversation._id);
    
    // In mobile view, hide the conversation list
    if (isMobile) {
      setShowConversationList(false);
    }
  };
  
  // Toggle back to conversation list in mobile view
  const handleBackToList = () => {
    setShowConversationList(true);
    clearActiveConversation();
  };
  
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)] flex flex-col">
      {/* Automatically load conversation from URL parameter */}
      {id && <ConversationLoader />}
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <div className="flex space-x-2">
          {isMobile && !showConversationList && (
            <button
              onClick={handleBackToList}
              className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          )}
          <button
            onClick={() => setShowUserDirectory(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            New Message
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Conversations panel - show/hide based on mobile state */}
        {(showConversationList || !isMobile) && (
          <div className={`${isMobile ? 'w-full' : 'w-1/3'} h-full flex flex-col overflow-hidden`}>
            <ConversationList 
              onSelectConversation={handleSelectConversation} 
            />
          </div>
        )}
        
        {/* Conversation view panel - show/hide based on mobile state */}
        {(!showConversationList || !isMobile) && (
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} h-full flex flex-col overflow-hidden`}>
            <ConversationView conversation={activeConversation} />
          </div>
        )}
      </div>
      
      {/* User directory modal */}
      {showUserDirectory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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