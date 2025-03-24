// src/components/boarding/BookingHistory.js
import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../../api/boarding';
import Alert from '../common/Alert';

const BookingHistory = ({ refresh }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  useEffect(() => {
    fetchBookings();
  }, [refresh]);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (error) {
      setMessage(error.message || 'Failed to fetch bookings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await cancelBooking(bookingId);
      setMessage('Booking cancelled successfully');
      setMessageType('success');
      fetchBookings(); // Refresh the list
    } catch (error) {
      setMessage(error.message || 'Failed to cancel booking');
      setMessageType('error');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Checked-in':
        return 'bg-blue-100 text-blue-800';
      case 'Checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      
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
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <div>
                  <span className="font-medium">{booking.petName}</span>
                  <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Booked on {formatDate(booking.createdAt)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Boarding Type</p>
                    <p className="font-medium">{booking.boardingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dates</p>
                    <p className="font-medium">
                      {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                  {booking.additionalServices && (
                    <div>
                      <p className="text-sm text-gray-500">Additional Services</p>
                      <p className="font-medium">{booking.additionalServices}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                
                {booking.specialNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Special Notes</p>
                    <p className="mt-1 text-gray-700">{booking.specialNotes}</p>
                  </div>
                )}
                
                {booking.status === 'Pending' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;