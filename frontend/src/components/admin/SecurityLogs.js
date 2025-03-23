// src/components/admin/SecurityLogs.js
import React, { useState, useEffect } from 'react';
import { getSecurityLogs, unlockUserAccount } from '../../api/admin';
import Alert from '../common/Alert';

const SecurityLogs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  useEffect(() => {
    fetchSecurityLogs();
  }, []);
  
  const fetchSecurityLogs = async () => {
    setLoading(true);
    try {
      const data = await getSecurityLogs();
      setUsers(data);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch security logs');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnlockAccount = async (userId) => {
    try {
      const response = await unlockUserAccount(userId);
      
      // Update the user in the state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, failedLoginAttempts: 0, accountLocked: false, accountLockedUntil: null } 
          : user
      ));
      
      setMessage(response.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Failed to unlock account');
      setMessageType('error');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Security Logs</h2>
      
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left border-b">Name</th>
              <th className="py-3 px-4 text-left border-b">Email</th>
              <th className="py-3 px-4 text-left border-b">Role</th>
              <th className="py-3 px-4 text-left border-b">Failed Attempts</th>
              <th className="py-3 px-4 text-left border-b">Status</th>
              <th className="py-3 px-4 text-left border-b">Last Attempt</th>
              <th className="py-3 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">No security logs found</td>
              </tr>
            ) : (
              users.map((user) => {
                const isLocked = user.accountLocked && user.accountLockedUntil > new Date().toISOString();
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.name}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">{user.role}</td>
                    <td className="py-3 px-4 border-b">{user.failedLoginAttempts}</td>
                    <td className="py-3 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isLocked
                          ? 'bg-red-100 text-red-800' 
                          : user.failedLoginAttempts > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {isLocked
                          ? 'Locked'
                          : user.failedLoginAttempts > 0
                            ? 'Warning'
                            : 'Normal'
                        }
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">{formatDate(user.lastLoginAttempt)}</td>
                    <td className="py-3 px-4 border-b">
                      {(isLocked || user.failedLoginAttempts > 0) && (
                        <button
                          onClick={() => handleUnlockAccount(user._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Unlock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <button
          onClick={fetchSecurityLogs}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SecurityLogs;
