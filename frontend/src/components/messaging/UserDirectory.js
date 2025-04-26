// src/components/messaging/UserDirectory.js
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getAvailableVeterinarians, getPetOwners } from '../../api/messaging';
import { useAuth } from '../../context/AuthContext';
import { useMessaging } from '../../context/MessagingContext';

const UserDirectory = ({ onStartConversation, onClose }) => {
  const { user } = useAuth();
  const { startConversation } = useMessaging();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load appropriate users based on current user's role
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        let loadedUsers = [];
        
        // Pet owners see veterinarians
        if (user.role === 'Pet Owner') {
          loadedUsers = await getAvailableVeterinarians();
        }
        // Veterinarians and admins see pet owners
        else if (user.role === 'Veterinarian' || user.role === 'Admin') {
          loadedUsers = await getPetOwners();
        }
        // Receptionists see both
        else if (user.role === 'Receptionist') {
          const vets = await getAvailableVeterinarians();
          const owners = await getPetOwners();
          loadedUsers = [...vets, ...owners];
        }
        
        setUsers(loadedUsers);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [user.role]);

  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phonenumber && user.phonenumber.includes(searchTerm))
      )
    : users;

  // Handle user selection for messaging
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Start a new conversation with selected user
  const handleStartConversation = async () => {
    if (!selectedUser) return;
    
    setSendingMessage(true);
    try {
      const conversation = await startConversation(selectedUser._id, initialMessage);
      
      if (onStartConversation) {
        onStartConversation(conversation);
      }
      
      // Close directory
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to start conversation');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full mx-auto">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-semibold">{selectedUser ? 'New Message' : 'People Directory'}</h2>
      </div>
      
      {!selectedUser ? (
        <>
          {/* Search bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* User list */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-600">
                <p>{error}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No users match your search' : 'No users available'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <li
                    key={user._id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* User avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User info */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate">{user.email}</span>
                          {user.role && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div className="p-4">
          <div className="mb-4">
            <div className="font-medium text-gray-700 mb-1">To:</div>
            <div className="flex items-center bg-blue-50 p-2 rounded-md">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-2">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-xs text-gray-500">{selectedUser.email}</div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Message:</label>
            <textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStartConversation}
              disabled={sendingMessage || !initialMessage.trim()}
              className={`px-4 py-2 rounded-md ${
                !initialMessage.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {sendingMessage ? 'Sending...' : 'Start Conversation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;