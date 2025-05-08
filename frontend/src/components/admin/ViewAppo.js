
import React, { useState, useEffect } from 'react';
import axios from "axios";

const AdminAppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/appointments');
      setAppointments(res.data.Appointments || []);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch appointments');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
const handleStatusChange = async (id, newStatus) => {
  try {
    const response = await axios.patch(
      `http://localhost:5001/appointments/status/${id}`,
      { status: newStatus }
    );

    if (response.data) {
      setAppointments(appointments.map(app => 
        app._id === id ? response.data : app
      ));
      setMessage(`Status updated & email sent to ${response.data.name}`);
      setMessageType('success');
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Status updated but email failed");
    setMessageType('warning');
  }
};


  const confirmDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setAppointmentToDelete(null);
    setShowDeleteModal(false);
  };

const handleDeleteAppointment = async () => {
  if (!appointmentToDelete) return;
  setDeleteLoading(true);

  try {
    const response = await axios.delete(
      `http://localhost:5001/appointments/${appointmentToDelete._id}`
    );

    if (response.status === 200) {
      setAppointments(prev => 
        prev.filter(app => app._id !== appointmentToDelete._id)
      );
      setMessage('Appointment deleted successfully');
      setMessageType('success');
    }
  } catch (error) {
    console.error("Delete error:", error);
    setMessage(
      error.response?.data?.message || 
      'Failed to delete appointment. Please try again.'
    );
    setMessageType('error');
  } finally {
    setDeleteLoading(false);
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  }
};


  const filteredAppointments = appointments.filter(app =>
    (app.petID && app.petID.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (app.name && app.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status] || 'bg-gray-100'}`}>
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Appointment Requests</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Pet ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {message && (
        <div className={`mb-4 p-2 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No matching appointments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left border-b">Name</th>
                <th className="py-3 px-4 text-left border-b">Contact</th>
                <th className="py-3 px-4 text-left border-b">Email</th>
                <th className="py-3 px-4 text-left border-b">NIC</th>
                <th className="py-3 px-4 text-left border-b">Pet ID</th>
                <th className="py-3 px-4 text-left border-b">Type</th>
                <th className="py-3 px-4 text-left border-b">Status</th>
                <th className="py-3 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{app.name}</td>
                  <td className="py-3 px-4 border-b">{app.contact}</td>
                  <td className="py-3 px-4 border-b">{app.gmail}</td>
                  <td className="py-3 px-4 border-b">{app.nic}</td>
                  <td className="py-3 px-4 border-b">{app.petID}</td>
                  <td className="py-3 px-4 border-b">{app.appointmentType}</td>
                  <td className="py-3 px-4 border-b">
                    {getStatusBadge(app.status)}

                  </td>
                  <td className="py-3 px-4 border-b">
                  <div className="mt-2">
                      <select
                        value={app.status || 'Pending'}
                        onChange={e => handleStatusChange(app._id, e.target.value)}
                        className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <button
                      onClick={() => confirmDelete(app)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
                      title="Delete appointment"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Appointment</h3>
            <p className="mb-6">
              Are you sure you want to delete the appointment for
              <span className="font-semibold"> {appointmentToDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentManagement;
