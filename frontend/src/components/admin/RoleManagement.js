// src/components/admin/RoleManagement.js
import React, { useState, useEffect } from 'react';
import { changeUserRole, updateUserPermissions } from '../../api/admin';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RoleManagement = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [reason, setReason] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  // Permissions state
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  
  // Update component when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setPermissions(user.permissions || []);
    }
  }, [user]);
  
  // All possible permissions
  const allPermissions = [
    { id: "manage_users", label: "Manage Users", description: "Create, update, and delete user accounts" },
    { id: "view_all_records", label: "View All Records", description: "Access all patient records" },
    { id: "manage_appointments", label: "Manage Appointments", description: "Create and modify all appointments" },
    { id: "manage_settings", label: "Manage Settings", description: "Change system settings" },
    { id: "generate_reports", label: "Generate Reports", description: "Create system reports and analytics" },
    { id: "view_analytics", label: "View Analytics", description: "Access system analytics and metrics" },
    { id: "view_patient_records", label: "View Patient Records", description: "Access assigned patient records" },
    { id: "update_medical_records", label: "Update Medical Records", description: "Modify medical records" },
    { id: "view_own_schedule", label: "View Own Schedule", description: "See your appointment schedule" },
    { id: "view_appointments", label: "View Appointments", description: "See all appointments" },
    { id: "schedule_appointments", label: "Schedule Appointments", description: "Create and modify appointments" },
    { id: "register_patients", label: "Register Patients", description: "Add new patients to the system" },
    { id: "view_patient_basic_info", label: "View Patient Basic Info", description: "See basic patient information" },
    { id: "view_own_pets", label: "View Own Pets", description: "See your own pets" },
    { id: "view_own_appointments", label: "View Own Appointments", description: "See your scheduled appointments" },
    { id: "book_appointments", label: "Book Appointments", description: "Schedule new appointments" },
    { id: "update_own_profile", label: "Update Own Profile", description: "Modify your user profile" }
  ];
  
  const handleRoleChange = async () => {
    if (!user || !selectedRole) return;
    
    setLoading(true);
    try {
      const response = await changeUserRole(user._id, selectedRole, reason);
      
      setMessage('User role updated successfully');
      setMessageType('success');
      setShowRoleModal(false);
      
      // Notify parent component
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update user role');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePermissionChange = (permissionId) => {
    setPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(p => p !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  const savePermissions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await updateUserPermissions(user._id, permissions);
      
      setMessage('User permissions updated successfully');
      setMessageType('success');
      setShowPermissionsModal(false);
      
      // Notify parent component
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update user permissions');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}
      
      <div className="flex space-x-2 mb-2">
        <Button
          onClick={() => setShowRoleModal(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
        >
          Change Role
        </Button>
        
        <Button
          onClick={() => setShowPermissionsModal(true)}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded"
        >
          Manage Permissions
        </Button>
      </div>
      
      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Change User Role</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Role: <span className="font-normal">{user?.role}</span>
              </label>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Pet Owner">Pet Owner</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reason for Change
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Provide a reason for this role change"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRoleChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading || !selectedRole}
              >
                {loading ? 'Updating...' : 'Change Role'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Manage User Permissions</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Role: {user?.role}</h4>
              <p className="text-sm text-gray-600 mb-4">
                These permissions override the default role-based permissions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {allPermissions.map(permission => (
                  <div key={permission.id} className="flex items-start p-2 border rounded">
                    <input
                      type="checkbox"
                      id={`perm-${permission.id}`}
                      checked={permissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="mt-1 mr-2"
                    />
                    <div>
                      <label htmlFor={`perm-${permission.id}`} className="font-medium">
                        {permission.label}
                      </label>
                      <p className="text-xs text-gray-600">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={savePermissions}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Permissions'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
//error fix worked