// src/context/MessagingContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getConversations,
  getConversation,
  createConversation,
  sendMessage as apiSendMessage,
  getMessages as apiGetMessages
} from '../api/messaging';
import socketService from '../services/socketService';

const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const { isAuth, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Initialize socket when authenticated
  useEffect(() => {
    if (isAuth) {
      const socket = socketService.initializeSocket();
      
      // Cleanup on unmount
      return () => {
        socketService.closeSocket();
      };
    }
  }, [isAuth]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!isAuth) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getConversations();
      setConversations(data);
      
      // Initialize unread counts
      const counts = {};
      data.forEach((conv) => {
        if (conv.unreadCount && conv.unreadCount[user.id]) {
          counts[conv._id] = conv.unreadCount[user.id];
        }
      });
      setUnreadCounts(counts);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [isAuth, user]);

  // Load or refresh a specific conversation
  const loadConversation = useCallback(async (conversationId) => {
    if (!isAuth || !conversationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getConversation(conversationId);
      
      // Update the conversation in the list
      setConversations(prevConversations => {
        const index = prevConversations.findIndex(c => c._id === conversationId);
        if (index >= 0) {
          const updated = [...prevConversations];
          updated[index] = data;
          return updated;
        }
        return [data, ...prevConversations];
      });
      
      setActiveConversation(data);
      
      // Reset unread count for this conversation
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
      
      // Join conversation room for real-time updates
      socketService.joinConversation(conversationId);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  // Start a new conversation
  const startConversation = useCallback(async (receiverId, initialMessage) => {
    if (!isAuth) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newConversation = await createConversation(receiverId, initialMessage);
      
      // Add to conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // Set as active conversation
      setActiveConversation(newConversation);
      
      // Join conversation room
      socketService.joinConversation(newConversation._id);
      
      return newConversation;
    } catch (err) {
      setError(err.message || 'Failed to start conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId, page = 1) => {
    if (!isAuth || !conversationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiGetMessages(conversationId, page);
      
      if (page === 1) {
        // First page - replace existing messages
        setMessages(data.messages);
      } else {
        // Additional pages - prepend to existing messages (for older messages)
        setMessages(prev => [...data.messages, ...prev]);
      }
      
      setPagination(data.pagination);
      
      // Mark messages as read
      socketService.markMessagesAsRead(conversationId);
      
      return data.messages;
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  // Send a new message
  const sendMessage = useCallback(async (conversationId, content, attachments = []) => {
    if (!isAuth || !conversationId || !content) return null;
    
    setError(null);
    
    try {
      const newMessage = await apiSendMessage(conversationId, content, attachments);
      
      // Add to messages
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation in list
      setConversations(prevConversations => {
        const updated = prevConversations.map(conv => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: content,
              lastMessageTime: new Date().toISOString()
            };
          }
          return conv;
        });
        
        // Sort by most recent message
        return updated.sort((a, b) => 
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
      });
      
      return newMessage;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      return null;
    }
  }, [isAuth]);

  // Set up socket event listeners
  useEffect(() => {
    if (!isAuth) return;
    
    // New message handler
    const messageHandler = ({ message, conversation }) => {
      // If from the active conversation, add to messages
      if (activeConversation && conversation._id === activeConversation._id) {
        setMessages(prev => [...prev, message]);
        socketService.markMessagesAsRead(conversation._id);
      } else {
        // Update unread count
        setUnreadCounts(prev => ({
          ...prev,
          [conversation._id]: (prev[conversation._id] || 0) + 1
        }));
      }
      
      // Update conversation in list
      setConversations(prevConversations => {
        const index = prevConversations.findIndex(c => c._id === conversation._id);
        
        if (index >= 0) {
          const updated = [...prevConversations];
          updated[index] = {
            ...updated[index],
            lastMessage: message.content,
            lastMessageTime: message.createdAt
          };
          
          // Sort by most recent message
          return updated.sort((a, b) => 
            new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
        }
        
        // If not in list, add it
        return [conversation, ...prevConversations];
      });
    };
    
    // Typing indicator handler
    const typingHandler = ({ userId, userName, isTyping, conversationId }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return {
            ...prev,
            [conversationId]: {
              ...prev[conversationId],
              [userId]: {
                name: userName,
                timestamp: Date.now()
              }
            }
          };
        } else {
          // User stopped typing
          const updated = { ...prev };
          if (updated[conversationId]) {
            delete updated[conversationId][userId];
          }
          return updated;
        }
      });
    };
    
    // Read receipts handler
    const readHandler = ({ userId, conversationId }) => {
      // If the current user's messages were read by someone else
      if (userId !== user.id && activeConversation && activeConversation._id === conversationId) {
        // You could update read status on messages here
        console.log(`Messages read by ${userId} in conversation ${conversationId}`);
      }
    };
    
    // Set up listeners
    const removeNewMessageListener = socketService.onNewMessage(messageHandler);
    const removeNotificationListener = socketService.onMessageNotification(messageHandler);
    const removeTypingListener = socketService.onUserTyping(typingHandler);
    const removeReadListener = socketService.onMessagesRead(readHandler);
    
    // Clean up listeners on unmount
    return () => {
      removeNewMessageListener();
      removeNotificationListener();
      removeTypingListener();
      removeReadListener();
    };
  }, [isAuth, activeConversation, user]);
  
  // Clean up typing indicators after a delay
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => {
        const now = Date.now();
        const updated = { ...prev };
        let changed = false;
        
        // Check each conversation
        Object.keys(updated).forEach(convId => {
          // Check each user
          Object.keys(updated[convId] || {}).forEach(userId => {
            // If typing indicator is older than 3 seconds, remove it
            if (now - updated[convId][userId].timestamp > 3000) {
              delete updated[convId][userId];
              changed = true;
            }
          });
          
          // If no users typing in this conversation, remove the entry
          if (Object.keys(updated[convId] || {}).length === 0) {
            delete updated[convId];
          }
        });
        
        return changed ? updated : prev;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Notify for typing
  const sendTypingStatus = useCallback((conversationId, isTyping) => {
    socketService.sendTypingStatus(conversationId, isTyping);
  }, []);

  // Clear active conversation on unmount
  const clearActiveConversation = useCallback(() => {
    if (activeConversation) {
      socketService.leaveConversation(activeConversation._id);
    }
    setActiveConversation(null);
    setMessages([]);
  }, [activeConversation]);

  // Value to provide in context
  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    typingUsers,
    unreadCounts,
    pagination,
    loadConversations,
    loadConversation,
    startConversation,
    loadMessages,
    sendMessage,
    sendTypingStatus,
    clearActiveConversation
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

// Custom hook to use the messaging context
export const useMessaging = () => useContext(MessagingContext);

export default MessagingContext;

//create messagingcontext