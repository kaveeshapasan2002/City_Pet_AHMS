// src/components/messaging/MessageItem.js
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FaEllipsisV, FaCheck, FaTimes, FaPen, FaTrash } from 'react-icons/fa';
import { useMessaging } from '../../context/MessagingContext';
import { getCurrentUser } from '../../api/auth';

const MessageItem = ({ message, isCurrentUser, showSenderInfo }) => {
  const { deleteMessage, updateMessage } = useMessaging();
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const optionsRef = useRef(null);
  const editInputRef = useRef(null);
  
  // Focus edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);
  
  // Handle click outside of options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
        setShowConfirmDelete(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
  
  // Handle message edit submission
  const handleEditSubmit = async () => {
    if (editContent.trim() === message.content) {
      // No changes, just cancel
      setIsEditing(false);
      return;
    }
    
    if (!editContent.trim()) {
      // Empty content, revert to original
      setEditContent(message.content);
      setIsEditing(false);
      return;
    }
    
    try {
      await updateMessage(message._id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update message:', error);
      // Keep edit mode open with current content
    }
  };
  
  // Handle message delete
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      console.log('Deleting message with ID:', message._id);
      const result = await deleteMessage(message._id);
      console.log('Delete result:', result);
      
      // Message will be removed from UI by the context
      setShowOptions(false);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Failed to delete message:', error);
      setDeleteError(error.message || 'Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };
  
  // Check if message is from current user
  if (!message || !message.sender) return null;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`max-w-[75%] relative`}>
        {/* Sender info */}
        {showSenderInfo && !isCurrentUser && message.sender && (
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
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={`w-full min-h-[60px] p-2 rounded mb-2 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white placeholder-blue-200 border border-blue-400'
                    : 'bg-gray-50 text-gray-800 border border-gray-300'
                }`}
                placeholder="Edit your message..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEdit}
                  className={`p-1 rounded ${
                    isCurrentUser
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaTimes size={14} />
                </button>
                <button
                  onClick={handleEditSubmit}
                  className={`p-1 rounded ${
                    isCurrentUser
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <FaCheck size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <p>{message.content}</p>
              {message.isEdited && (
                <span className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} ml-1`}>
                  (edited)
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Error message for deletion */}
        {deleteError && (
          <div className="text-xs text-red-500 mt-1">
            {deleteError}
          </div>
        )}
        
        {/* Options button - only visible for the user's own messages and when not editing */}
        {isCurrentUser && !isEditing && (
          <div 
            className={`absolute ${
              isCurrentUser ? 'left-0' : 'right-0'
            } top-0 transform ${
              isCurrentUser ? '-translate-x-full' : 'translate-x-full'
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <FaEllipsisV size={14} />
            </button>
            
            {/* Options menu */}
            {showOptions && (
              <div 
                ref={optionsRef}
                className="absolute top-full mt-1 left-0 bg-white shadow-lg rounded-md py-1 w-32 z-10"
              >
                {!showConfirmDelete ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaPen className="mr-2" size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FaTrash className="mr-2" size={12} />
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="p-2">
                    <p className="text-xs text-gray-800 mb-2">Delete this message?</p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
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
};

export default MessageItem;