// src/context/MessagingContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getConversations,
  getConversation,
  createConversation,
  sendMessage as apiSendMessage,
  getMessages as apiGetMessages,
  deleteMessage as apiDeleteMessage,
  updateMessage as apiUpdateMessage
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

  // Delete a message
  const deleteMessage = useCallback(async (messageId) => {
    if (!isAuth) return null;
    
    setError(null);
    
    try {
      console.log('Attempting to delete message with ID:', messageId);
      // Make sure to wait for the API call to complete
      const result = await apiDeleteMessage(messageId);
      console.log('Delete API response:', result);
      
      // Find the message in current messages
      const deletedMessage = messages.find(m => m._id === messageId);
      
      if (deletedMessage) {
        console.log('Found message to delete in UI:', deletedMessage);
        
        // Remove from messages list
        setMessages(prev => {
          console.log('Removing message from UI, previous count:', prev.length);
          const newMessages = prev.filter(m => m._id !== messageId);
          console.log('New messages count after removal:', newMessages.length);
          return newMessages;
        });
        
        // If it was the last message, update conversation preview
        if (activeConversation) {
          console.log('Active conversation:', activeConversation);
          console.log('Last message in conversation:', activeConversation.lastMessage);
          console.log('Deleted message content:', deletedMessage.content);
          
          if (activeConversation.lastMessage === deletedMessage.content) {
            console.log('Deleted message was the last message in conversation');
            
            // Find the new last message in our current list
            const newLastMessages = messages
              .filter(m => m._id !== messageId)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            const newLastMessage = newLastMessages.length > 0 ? newLastMessages[0] : null;
            console.log('New last message:', newLastMessage);
            
            // Update active conversation
            setActiveConversation(prev => {
              const updated = {
                ...prev,
                lastMessage: newLastMessage ? newLastMessage.content : '',
                lastMessageTime: newLastMessage ? newLastMessage.createdAt : prev.createdAt
              };
              console.log('Updated active conversation:', updated);
              return updated;
            });
            
            // Update in conversations list
            setConversations(prev => {
              console.log('Updating conversations list');
              return prev.map(conv => {
                if (conv._id === activeConversation._id) {
                  return {
                    ...conv,
                    lastMessage: newLastMessage ? newLastMessage.content : '',
                    lastMessageTime: newLastMessage ? newLastMessage.createdAt : conv.createdAt
                  };
                }
                return conv;
              });
            });
          }
        }
      } else {
        console.log('Message not found in UI, might need to refresh conversations');
      }
      
      return result;
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.message || 'Failed to delete message');
      return null;
    }
  }, [isAuth, messages, activeConversation]);

  // Update a message
  const updateMessage = useCallback(async (messageId, content) => {
    if (!isAuth || !content.trim()) return null;
    
    setError(null);
    
    try {
      console.log('Attempting to update message with ID:', messageId);
      const updatedMessage = await apiUpdateMessage(messageId, content);
      console.log('Update API response:', updatedMessage);
      
      // Update in messages list
      setMessages(prev => {
        console.log('Updating message in UI');
        return prev.map(message => {
          if (message._id === messageId) {
            return {
              ...message,
              content,
              isEdited: true,
              editedAt: updatedMessage.editedAt
            };
          }
          return message;
        });
      });
      
      // If it was the last message, update conversation preview
      if (activeConversation && activeConversation.lastMessage) {
        const message = messages.find(m => m._id === messageId);
        if (message && activeConversation.lastMessage === message.content) {
          console.log('Updated message was the last message in conversation');
          
          // Update active conversation
          setActiveConversation(prev => ({
            ...prev,
            lastMessage: content
          }));
          
          // Update in conversations list
          setConversations(prev => {
            return prev.map(conv => {
              if (conv._id === activeConversation._id) {
                return {
                  ...conv,
                  lastMessage: content
                };
              }
              return conv;
            });
          });
        }
      }
      
      return updatedMessage;
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err.message || 'Failed to update message');
      return null;
    }
  }, [isAuth, messages, activeConversation]);

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
    
    // Message deleted handler
    const deletedHandler = ({ messageId, conversationId }) => {
      console.log('Socket: Message deleted event received:', messageId, conversationId);
      
      // If in active conversation, remove the message
      if (activeConversation && activeConversation._id === conversationId) {
        setMessages(prev => {
          console.log('Socket: Removing deleted message from UI');
          return prev.filter(m => m._id !== messageId);
        });
        
        // Find the new last message
        const newLastMessages = messages
          .filter(m => m._id !== messageId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const newLastMessage = newLastMessages.length > 0 ? newLastMessages[0] : null;
        
        // Update active conversation if needed
        setActiveConversation(prev => {
          console.log('Socket: Updating active conversation after deletion');
          return {
            ...prev,
            lastMessage: newLastMessage ? newLastMessage.content : '',
            lastMessageTime: newLastMessage ? newLastMessage.createdAt : prev.createdAt
          };
        });
      }
      
      // Update conversation in list
      setConversations(prevConversations => {
        console.log('Socket: Updating conversations list after deletion');
        const conversation = prevConversations.find(c => c._id === conversationId);
        
        if (conversation) {
          // Determine if we need to update the last message
          // This is a best guess without fetching from server
          const updatedConversations = prevConversations.map(conv => {
            if (conv._id === conversationId) {
              // If this is the active conversation and we have messages data
              if (activeConversation && activeConversation._id === conversationId && messages.length > 0) {
                const newLastMessages = messages
                  .filter(m => m._id !== messageId)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                const newLastMessage = newLastMessages.length > 0 ? newLastMessages[0] : null;
                
                if (newLastMessage) {
                  return {
                    ...conv,
                    lastMessage: newLastMessage.content,
                    lastMessageTime: newLastMessage.createdAt
                  };
                }
              }
              
              // Otherwise, leave as is for now - we'll need a refresh to get accurate data
              return conv;
            }
            return conv;
          });
          
          return updatedConversations;
        }
        
        return prevConversations;
      });
    };
    
    // Message updated handler
    const updatedHandler = ({ message, conversationId }) => {
      console.log('Socket: Message updated event received:', message._id, conversationId);
      
      // If in active conversation, update the message
      if (activeConversation && activeConversation._id === conversationId) {
        setMessages(prev => {
          console.log('Socket: Updating message in UI');
          return prev.map(m => {
            if (m._id === message._id) {
              return {
                ...m,
                content: message.content,
                isEdited: true,
                editedAt: message.editedAt
              };
            }
            return m;
          });
        });
      }
      
      // Update conversation in list if it was the last message
      setConversations(prevConversations => {
        console.log('Socket: Checking if need to update conversation preview');
        return prevConversations.map(conv => {
          if (conv._id === conversationId) {
            // If this message might have been the last one
            const lastMessageTime = new Date(conv.lastMessageTime).getTime();
            const messageTime = new Date(message.createdAt).getTime();
            
            // If this was the last message, update it
            if (Math.abs(lastMessageTime - messageTime) < 1000) { // Within 1 second, likely the same
              console.log('Socket: Updating conversation preview with edited message');
              return {
                ...conv,
                lastMessage: message.content
              };
            }
          }
          return conv;
        });
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
    const removeDeletedListener = socketService.onMessageDeleted(deletedHandler);
    const removeUpdatedListener = socketService.onMessageUpdated(updatedHandler);
    
    // Clean up listeners on unmount
    return () => {
      removeNewMessageListener();
      removeNotificationListener();
      removeTypingListener();
      removeReadListener();
      removeDeletedListener();
      removeUpdatedListener();
    };
  }, [isAuth, activeConversation, user, messages]);
  
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
    deleteMessage,
    updateMessage,
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