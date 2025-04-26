// src/components/messaging/NotificationBadge.js
import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from '../../api/messaging';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBadge = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up interval to refresh notifications
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      
      // Count unread notifications
      const unread = data.notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.notification-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Format notification time
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return '';
    }
  };

  // Get notification link based on type and related ID
  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'message':
        return `/messages/conversation/${notification.relatedId}`;
      case 'appointment':
        return `/appointments/${notification.relatedId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="relative notification-dropdown">
      {/* Notification bell icon with badge */}
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full relative"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-3 bg-blue-600 text-white font-semibold flex justify-between items-center">
            <h3>Notifications</h3>
            <span className="text-sm">
              {unreadCount} {unreadCount === 1 ? 'new' : 'new'}
            </span>
          </div>
          
          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <li 
                    key={notification._id}
                    className={`p-3 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <Link 
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification._id);
                        }
                        setShowDropdown(false);
                      }}
                      className="block"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-sm text-gray-800">
                          {notification.content}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.type === 'message' ? 'New message' : 
                         notification.type === 'appointment' ? 'Appointment' : 'System notification'}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t text-center">
            <Link 
              to="/notifications"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setShowDropdown(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;