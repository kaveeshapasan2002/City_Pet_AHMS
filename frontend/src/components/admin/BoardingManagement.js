// src/components/admin/BoardingManagement.js
import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../../api/admin';
import Alert from '../common/Alert';

const BoardingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings(); // This would be a new function to get all bookings
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
      
      // Update booking in the state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      setMessage(`Booking status updated to ${newStatus}`);
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Failed to update booking status');
      setMessageType('error');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Boarding Requests</h2>
      
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
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No booking requests found.</p>
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
              {bookings.map((booking) => (
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
    </div>
  );
};

export default BoardingManagement;