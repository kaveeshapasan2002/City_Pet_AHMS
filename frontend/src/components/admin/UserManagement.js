// src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { getUsers, toggleUserStatus, deleteUser } from '../../api/admin';
import Alert from '../common/Alert';
import RoleManagement from './RoleManagement';
import Button from '../common/Button'; // Assuming Button component is available

const UserManagement = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Delete Confirmation
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Selected user for Role Management
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filters = { search, role: roleFilter, status: statusFilter };
      const data = await getUsers(filters);
      setUsers(data);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch users');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await toggleUserStatus(userId);
      setUsers(users.map(user =>
        user._id === userId ? { ...user, isActive: !user.isActive } : user
      ));
      setMessage(response.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Failed to update user status');
      setMessageType('error');
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await deleteUser(userToDelete._id);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setMessage(response.message || 'User deleted successfully');
      setMessageType('success');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      setMessage(error.message || 'Failed to delete user');
      setMessageType('error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">User List</h2>
      {message && (
        <Alert type={messageType} message={message} onClose={() => setMessage('')} className="mb-4" />
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            🔍
          </button>
        </form>

        <select
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Veterinarian">Veterinarian</option>
          <option value="Pet Owner">Pet Owner</option>
        </select>

        <select
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left border-b">Name</th>
              <th className="py-3 px-4 text-left border-b">Email</th>
              <th className="py-3 px-4 text-left border-b">Role</th>
              <th className="py-3 px-4 text-left border-b">Status</th>
              <th className="py-3 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">{user.role}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`px-3 py-1 rounded-md text-white text-sm ${user.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => setSelectedUserForRole(user)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Manage Role
                      </button>

                      <button
                        onClick={() => confirmDeleteUser(user)}
                        className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{userToDelete?.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <Button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-800">
                Cancel
              </Button>
              <Button onClick={handleDeleteUser} className="px-4 py-2 bg-red-600 text-white">
                {deleteLoading ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {selectedUserForRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Manage User Role & Permissions</h3>
              <button onClick={() => setSelectedUserForRole(null)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="mb-4">
              <p><strong>User:</strong> {selectedUserForRole.name}</p>
              <p><strong>Email:</strong> {selectedUserForRole.email}</p>
              <p><strong>Current Role:</strong> {selectedUserForRole.role}</p>
            </div>
            <RoleManagement user={selectedUserForRole} onUpdate={() => { fetchUsers(); setSelectedUserForRole(null); }} />
            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedUserForRole(null)} className="px-4 py-2 bg-gray-300 text-gray-800">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
