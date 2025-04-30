// src/components/messaging/ConversationLoader.js
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';

/**
 * This component handles automatically loading a conversation
 * when navigating directly to a conversation URL or from a notification
 */
const ConversationLoader = () => {
  const { id } = useParams();
  const { loadConversation } = useMessaging();
  
  useEffect(() => {
    if (id) {
      loadConversation(id);
    }
  }, [id, loadConversation]);
  
  // This is a utility component that doesn't render anything
  return null;
};

export default ConversationLoader;