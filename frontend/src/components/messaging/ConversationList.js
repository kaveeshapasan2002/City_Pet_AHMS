// src/components/messaging/ConversationList.js
import React, { useEffect, useState } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import { formatDistanceToNow } from 'date-fns';
import { FaSearch, FaCircle } from 'react-icons/fa';
// Add this import at the top with your other imports
import { getCurrentUser } from '../../api/auth';

const ConversationList = ({ onSelectConversation }) => {
  const { 
    conversations, 
    loadConversations, 
    loading, 
    error, 
    unreadCounts,
    activeConversation
  } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Filter conversations based on search term
  useEffect(() => {
    if (!conversations) return;
    
    if (!searchTerm.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = conversations.filter(conv => {
      // Search in participant names and last message
      return conv.participants.some(participant => 
        participant.name.toLowerCase().includes(searchTermLower)
      ) || (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchTermLower));
    });
    
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return timestamp;
    }
  };

  // Get other participant's name (assumes 2 participants)
  // Get other participant's name (assumes 2 participants)
const getOtherParticipantName = (conversation) => {
    if (!conversation || !conversation.participants) return 'Unknown';
    
    // Get current user ID
    const currentUser = getCurrentUser();
    const currentUserId = currentUser ? currentUser._id : '';
    
    // Find participant that is not the current user
    const otherParticipant = conversation.participants.find(
      p => p._id !== currentUserId
    );
    
    return otherParticipant ? otherParticipant.name : 'Unknown';
  };

  // Get other participant's role
  const getOtherParticipantRole = (conversation) => {
    if (!conversation || !conversation.participants) return '';
    
    // Find participant that is not the current user
    const otherParticipant = conversation.participants.find(
      p => p._id !== localStorage.getItem('userId')
    );
    
    return otherParticipant ? otherParticipant.role : '';
  };

  // Get profile picture
  const getProfilePicture = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    
    // Find participant that is not the current user
    const otherParticipant = conversation.participants.find(
      p => p._id !== localStorage.getItem('userId')
    );
    
    return otherParticipant && otherParticipant.profilePicture
      ? otherParticipant.profilePicture
      : null;
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>Error loading conversations: {error}</p>
        <button 
          onClick={loadConversations}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No conversations match your search' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation._id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                activeConversation && activeConversation._id === conversation._id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : ''
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                {/* Profile picture */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
                  {getProfilePicture(conversation) ? (
                    <img
                      src={getProfilePicture(conversation)}
                      alt={getOtherParticipantName(conversation)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-semibold">
                      {getOtherParticipantName(conversation).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getOtherParticipantName(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {getOtherParticipantRole(conversation) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                        {getOtherParticipantRole(conversation)}
                      </span>
                    )}
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
                
                {/* Unread indicator */}
                {unreadCounts[conversation._id] > 0 && (
                  <div className="flex-shrink-0 ml-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      {unreadCounts[conversation._id]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;

//create conversationlist component

//update