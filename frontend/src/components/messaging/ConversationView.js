// src/components/messaging/ConversationView.js
import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import { formatDistanceToNow, format } from 'date-fns';
import { FaPaperPlane, FaPaperclip, FaEllipsisV } from 'react-icons/fa';
import { getCurrentUser } from '../../api/auth';

const ConversationView = ({ conversation }) => {
  const { 
    messages, 
    loadMessages, 
    sendMessage, 
    loading,
    error,
    typingUsers,
    pagination,
    sendTypingStatus
  } = useMessaging();
  
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const currentUser = getCurrentUser();
  
  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      loadMessages(conversation._id);
    }
  }, [conversation, loadMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check if someone is typing in this conversation
  const isOtherUserTyping = conversation && typingUsers[conversation._id] && 
    Object.keys(typingUsers[conversation._id]).length > 0;
  
  // Get other participant's name
  const getOtherParticipantName = () => {
    if (!conversation || !conversation.participants) return 'Unknown';
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== currentUser._id
    );
    
    return otherParticipant ? otherParticipant.name : 'Unknown';
  };
  
  // Get other participant's role
  const getOtherParticipantRole = () => {
    if (!conversation || !conversation.participants) return '';
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== currentUser._id
    );
    
    return otherParticipant ? otherParticipant.role : '';
  };
  
  // Format message time
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // If today, show time only
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'h:mm a');
      }
      
      // If this week, show day and time
      if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return format(date, 'E h:mm a');
      }
      
      // Otherwise, show date
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (err) {
      return '';
    }
  };
  
  // Handle message input change
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Handle typing indicator
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      sendTypingStatus(conversation._id, true);
    }
    
    // Clear existing typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to stop typing indicator after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTypingStatus(conversation._id, false);
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };
  
  // Handle message submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Clear typing indicator
    if (isTyping) {
      setIsTyping(false);
      sendTypingStatus(conversation._id, false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
    
    // Send message
    await sendMessage(conversation._id, messageInput.trim());
    
    // Clear input
    setMessageInput('');
  };
  
  // Scroll to bottom of message list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Load more messages (older)
  const loadMoreMessages = () => {
    if (pagination.page < pagination.pages) {
      loadMessages(conversation._id, pagination.page + 1);
    }
  };
  
  // Check if a message is from the current user
  const isCurrentUserMessage = (message) => {
    return message.sender._id === currentUser._id;
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach(message => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [message]
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  };
  
  // Format group date
  const formatGroupDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return 'Today';
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      return format(date, 'MMMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };
  
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Conversation header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
            {getOtherParticipantName().charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{getOtherParticipantName()}</h2>
            {getOtherParticipantRole() && (
              <p className="text-xs text-gray-500">{getOtherParticipantRole()}</p>
            )}
          </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <FaEllipsisV />
        </button>
      </div>
      
      {/* Message list */}
      <div 
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
        ref={messageListRef}
      >
        {/* Load more button */}
        {pagination.page < pagination.pages && (
          <div className="text-center mb-4">
            <button
              onClick={loadMoreMessages}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            <p>Error: {error}</p>
          </div>
        )}
        
        {/* Messages grouped by date */}
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {/* Date divider */}
            <div className="flex justify-center mb-4">
              <div className="px-3 py-1 bg-gray-200 text-xs text-gray-600 rounded-full">
                {formatGroupDate(group.date)}
              </div>
            </div>
            
            {/* Messages */}
            {group.messages.map((message, messageIndex) => {
              const isCurrentUser = isCurrentUserMessage(message);
              const showSenderInfo = messageIndex === 0 || 
                group.messages[messageIndex - 1].sender._id !== message.sender._id;
              
              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`max-w-[75%]`}>
                    {/* Sender info */}
                    {showSenderInfo && !isCurrentUser && (
                      <div className="text-xs text-gray-500 mb-1 ml-1">
                        {message.sender.name}
                      </div>
                    )}
                    
                    {/* Message content */}
                    <div
                      className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    
                    {/* Timestamp */}
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-right text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isOtherUserTyping && (
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="text-xs text-gray-500 ml-2">
              {getOtherParticipantName()} is typing...
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className={`p-2 rounded-full ${
              messageInput.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;