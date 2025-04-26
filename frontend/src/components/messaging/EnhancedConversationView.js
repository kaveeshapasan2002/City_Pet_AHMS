// src/components/messaging/EnhancedConversationView.js
import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import ConversationView from './ConversationView';
import PatientContextPanel from './PatientContextPanel';

const EnhancedConversationView = ({ conversation }) => {
  const { user } = useAuth();
  const [messageInputRef, setMessageInputRef] = useState(null);
  const [petOwnerId, setPetOwnerId] = useState(null);
  
  // Find pet owner ID from conversation participants
  useEffect(() => {
    if (conversation && user.role === 'Veterinarian') {
      const owner = conversation.participants.find(
        participant => participant.role === 'Pet Owner'
      );
      
      if (owner) {
        setPetOwnerId(owner._id);
      }
    }
  }, [conversation, user.role]);
  
  // Handle template insertion
  const handleInsertTemplate = (templateText) => {
    if (messageInputRef && messageInputRef.current) {
      const input = messageInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;
      
      // Insert template at cursor position
      input.value = value.substring(0, start) + templateText + value.substring(end);
      
      // Move cursor to end of inserted text
      const newCursorPos = start + templateText.length;
      input.selectionStart = newCursorPos;
      input.selectionEnd = newCursorPos;
      
      // Focus on input
      input.focus();
      
      // Trigger onChange event to update state
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };
  
  return (
    <div className={`flex ${user.role === 'Veterinarian' && petOwnerId ? 'flex-row' : 'flex-col'} h-full`}>
      <div className={`${user.role === 'Veterinarian' && petOwnerId ? 'flex-1' : 'w-full'}`}>
        <ConversationView 
          conversation={conversation} 
          messageInputRef={setMessageInputRef} 
        />
      </div>
      
      {user.role === 'Veterinarian' && petOwnerId && (
        <div className="w-64 ml-4 flex-shrink-0">
          <PatientContextPanel 
            petOwnerId={petOwnerId} 
            onInsertTemplate={handleInsertTemplate} 
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedConversationView;