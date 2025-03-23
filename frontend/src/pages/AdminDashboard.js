// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import AddUserForm from '../components/admin/AddUserForm';

const AdminDashboard = () => {
  const { isAuth, user } = useAuth();
  const [refreshUserList, setRefreshUserList] = useState(false);

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
              <a href="#" className="block px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium">
                User Management
              </a>
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
            <AddUserForm onUserAdded={handleUserAdded} />
            <UserManagement refreshTrigger={refreshUserList} /> 
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
//fix that bug inhere(user add button not display)
