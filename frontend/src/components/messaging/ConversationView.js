// src/components/messaging/ConversationView.js
import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import { format } from 'date-fns';
import { FaPaperPlane, FaPaperclip, FaEllipsisV } from 'react-icons/fa';
import { getCurrentUser } from '../../api/auth';
import MessageItem from './MessageItem';

const ConversationView = ({ conversation, messageInputRef }) => {
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const currentUser = getCurrentUser();
  
  // Expose input ref if callback is provided
  useEffect(() => {
    if (messageInputRef && typeof messageInputRef === 'function') {
      messageInputRef(inputRef);
    }
  }, [messageInputRef]);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      loadMessages(conversation._id);
    }
  }, [conversation, loadMessages]);
  
  // Scroll to bottom when messages change, but only if already near bottom
  useEffect(() => {
    if (messages && messagesEndRef.current && messageListRef.current) {
      const isScrolledToBottom = 
        (messageListRef.current.scrollHeight - messageListRef.current.scrollTop <= 
         messageListRef.current.clientHeight + 100);
      
      if (isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Handle initial load of conversation - scroll to bottom
  useEffect(() => {
    if (conversation?._id && messageListRef.current) {
      // Force immediate scroll to bottom on initial load
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      
      // Use a short timeout as fallback to ensure the DOM has updated
      setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [conversation?._id, messages]);
  
  // Ensure proper scroll position after window resize
  useEffect(() => {
    const handleResize = () => {
      if (messageListRef.current && messagesEndRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if someone is typing in this conversation
  const isOtherUserTyping = conversation && typingUsers[conversation._id] && 
    Object.keys(typingUsers[conversation._id]).length > 0;
  
  // Get other participant's name
  const getOtherParticipantName = () => {
    if (!conversation || !conversation.participants) return 'Unknown';
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== (currentUser?._id || '')
    );
    
    return otherParticipant ? otherParticipant.name : 'Unknown';
  };
  
  // Get other participant's role
  const getOtherParticipantRole = () => {
    if (!conversation || !conversation.participants) return '';
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== (currentUser?._id || '')
    );
    
    return otherParticipant ? otherParticipant.role : '';
  };
  
  // Handle scroll events to show/hide scroll button
  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      // Show button when scrolled up more than 200px from bottom
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    }
  };
  
  // Scroll to bottom of message list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle message input change
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Only send typing status if we have a valid conversation
    if (!conversation?._id) return;
    
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
    
    if (!messageInput.trim() || !conversation?._id) return;
    
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

    // Force scroll to bottom when sending a message
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, 100);
  };
  
  // Load more messages (older)
  const loadMoreMessages = () => {
    if (conversation?._id && pagination && pagination.page < pagination.pages) {
      loadMessages(conversation._id, pagination.page + 1);
    }
  };
  
  // Check if a message is from the current user
  const isCurrentUserMessage = (message) => {
    // Added null check for currentUser
    return currentUser && message.sender && message.sender._id === currentUser._id;
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    if (!messages || !Array.isArray(messages)) return [];
    
    const groups = [];
    let currentDate = null;
    
    messages.forEach(message => {
      if (!message || !message.createdAt) return;

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
  
  // Pre-compute name's first character to avoid error in rendering
  const otherParticipantName = getOtherParticipantName();
  const firstCharacter = otherParticipantName && typeof otherParticipantName === 'string' 
    ? otherParticipantName.charAt(0).toUpperCase() 
    : '?';
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Conversation header */}
      <div className="p-4 border-b bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
            {firstCharacter}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{otherParticipantName}</h2>
            {getOtherParticipantRole() && (
              <p className="text-xs text-gray-500">{getOtherParticipantRole()}</p>
            )}
          </div>
        </div>
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Conversation options"
        >
          <FaEllipsisV />
        </button>
      </div>
      
      {/* Message list - IMPORTANT: This div controls scrolling */}
      <div 
        className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-0 max-h-[calc(100vh-250px)] message-container"
        ref={messageListRef}
        onScroll={handleScroll}
        style={{ 
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' // Improves scrolling on iOS
        }}
      >
        {/* Load more button */}
        {pagination && pagination.page < pagination.pages && (
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
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-10 scroll-button"
            aria-label="Scroll to bottom"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        
        {/* Messages grouped by date */}
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6 message-group">
            {/* Date divider */}
            <div className="flex justify-center mb-4">
              <div className="px-3 py-1 bg-gray-200 text-xs text-gray-600 rounded-full">
                {formatGroupDate(group.date)}
              </div>
            </div>
            
            {/* Messages */}
            {group.messages.map((message, messageIndex) => {
              if (!message || !message.sender) return null;
              
              const isCurrentUser = isCurrentUserMessage(message);
              const showSenderInfo = messageIndex === 0 || 
                (group.messages[messageIndex - 1].sender && message.sender &&
                 group.messages[messageIndex - 1].sender._id !== message.sender._id);
              
              return (
                <MessageItem
                  key={message._id || messageIndex}
                  message={message}
                  isCurrentUser={isCurrentUser}
                  showSenderInfo={showSenderInfo}
                />
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
              {otherParticipantName} is typing...
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t bg-white flex-shrink-0 message-input-container">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            aria-label="Attach file"
          >
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={!messageInput.trim() || !conversation?._id}
            className={`p-2 rounded-full ${
              messageInput.trim() && conversation?._id
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;