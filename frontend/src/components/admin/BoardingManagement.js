import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, deleteBooking } from '../../api/admin'; // Add deleteBooking import
import Alert from '../common/Alert';
/**/import { useNavigate } from 'react-router-dom';

const BoardingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const navigate = useNavigate();
/**/
  const handleDailyRecords = (bookingId) => {
    navigate(`/admin/boarding/${bookingId}/daily-records`);
  };
/**/
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch bookings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      setMessage('Booking status updated to ${newStatus}');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Failed to update booking status');
      setMessageType('error');
    }
  };


  // Function to open delete confirmation modal
  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setBookingToDelete(null);
    setShowDeleteModal(false);
  };

  // Function to handle the actual deletion
  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteBooking(bookingToDelete._id);
      
      // Remove the deleted booking from state
      setBookings(bookings.filter(booking => booking._id !== bookingToDelete._id));
      
      setMessage('Booking deleted successfully');
      setMessageType('success');
      setShowDeleteModal(false);
      setBookingToDelete(null);
    } catch (error) {
      setMessage(error.message || 'Failed to delete booking');
      setMessageType('error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filtered bookings based on search query
  const filteredBookings = bookings.filter(booking =>
    booking.petName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Boarding Requests</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Pet Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}

      {loading ? (
        <div className="text-center py-4">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No matching bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left border-b">Pet Name</th>
                <th className="py-3 px-4 text-left border-b">Owner</th>
                <th className="py-3 px-4 text-left border-b">Dates</th>
                <th className="py-3 px-4 text-left border-b">Type</th>
                <th className="py-3 px-4 text-left border-b">Status</th>
                <th className="py-3 px-4 text-left border-b">Price</th>
                <th className="py-3 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{booking.petName}</td>
                  <td className="py-3 px-4 border-b">{booking.user?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 border-b">
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="py-3 px-4 border-b">{booking.boardingType}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Checked-in' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'Checked-out' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">${booking.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex items-center space-x-2">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked-in">Checked-in</option>
                        <option value="Checked-out">Checked-out</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      
                      <button
                        onClick={() => confirmDelete(booking)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
                        title="Delete booking"
                      >
                        🗑
                      </button>
                    </div>

    {/* ✅ Daily Records button (only if Confirmed) */}
    {booking.status === 'Confirmed' && (
      <button
        onClick={() => handleDailyRecords(booking._id)}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
      >
        Daily Records
      </button>
    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Booking</h3>
            <p className="mb-6">
              Are you sure you want to delete the booking for 
              <span className="font-semibold"> {bookingToDelete?.petName}</span>?
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
                onClick={handleDeleteBooking}
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

export default BoardingManagement;