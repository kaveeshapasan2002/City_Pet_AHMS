import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import AddUserForm from '../components/admin/AddUserForm';
import SecurityLogs from '../components/admin/SecurityLogs';
import BoardingManagement from '../components/admin/BoardingManagement';

const AdminDashboard = () => {
  const { isAuth, user } = useAuth();
  const [refreshUserList, setRefreshUserList] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'security', 'boarding'

  console.log("User data:", user); // Debug output

  // Redirect if not authenticated or not an admin
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  if (user && user.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  // Callback for when a user is added
  const handleUserAdded = () => {
    // Trigger a refresh in the UserManagement component
    setRefreshUserList(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('users')}
                className={`block w-full text-left px-4 py-2 rounded-md font-medium ${
                  activeTab === 'users' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                User Management
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`block w-full text-left px-4 py-2 rounded-md font-medium ${
                  activeTab === 'security' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Security Logs
              </button>
              <button 
                onClick={() => setActiveTab('boarding')}
                className={`block w-full text-left px-4 py-2 rounded-md font-medium ${
                  activeTab === 'boarding' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pet Boarding
              </button>
              
              {/* New Management Links */}
              <Link 
                to="/inventory"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Inventory Management
              </Link>
              <Link 
                to="/financial-management"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Financial Management
              </Link>
              
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Appointment Overview
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                System Settings
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Report Generation
              </a>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'users' && (
              <div>
                <AddUserForm onUserAdded={handleUserAdded} />
                <UserManagement refreshTrigger={refreshUserList} />
              </div>
            )}
            
            {activeTab === 'security' && (
              <SecurityLogs />
            )}

            {activeTab === 'boarding' && (
              <BoardingManagement />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;