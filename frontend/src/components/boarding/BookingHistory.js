// src/components/boarding/BookingHistory.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../../api/boarding';
import Alert from '../common/Alert';
import { useReactToPrint } from 'react-to-print';

const BookingHistory = ({ refresh }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Create single ref for printing
  const printRef = useRef(null);
  const [printingBookingId, setPrintingBookingId] = useState(null);
  
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

  // Set up print handler
  const handlePrint = useReactToPrint({
    // Using contentRef instead of content
    contentRef: printRef,
    documentTitle: "Boarding_Report",
    onAfterPrint: () => {
      alert("Booking report successfully downloaded!");
      setPrintingBookingId(null);
    }
  });
  
  // Function to handle printing a specific booking
  const printBooking = (bookingId) => {
    setPrintingBookingId(bookingId);
    // Delay slightly to ensure state updates before printing
    setTimeout(() => {
      handlePrint();
    }, 100);
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

  // Navigate to update booking page
  const handleUpdateBooking = (bookingId) => {
    navigate(`/update-booking/${bookingId}`);
  };
  
  // Add this function to navigate to daily records
  const handleViewRecords = (bookingId) => {
    navigate(`/boarding/${bookingId}/records`);
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

  // Find booking to print
  const bookingToPrint = bookings.find(b => b._id === printingBookingId);

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
              </div>
              
              <div className="p-4">
                {booking.status === 'Pending' && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleUpdateBooking(booking._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Update Booking
                    </button>

                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" 
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
                
                {/* Button row for printing and viewing records */}
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => printBooking(booking._id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" 
                  >
                    Download Report
                  </button>
                  
                  {/* Daily Records button for confirmed, checked-in, or checked-out bookings */}
                  {(booking.status === 'Confirmed' || booking.status === 'Checked-in' || booking.status === 'Checked-out') && (
                    <button
                      onClick={() => handleViewRecords(booking._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View Daily Records
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden printable component */}
      <div style={{ display: 'none' }}>
        {bookingToPrint && (
          <div ref={printRef} className="p-8">
            <div className="print-content">
              <h2 className="text-2xl font-bold mb-6 text-center">Booking Report</h2>
              <div className="border-b pb-4 mb-4">
                <p className="text-lg font-bold">{bookingToPrint.petName}</p>
                <p className="text-sm text-gray-500">Status: {bookingToPrint.status}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Boarding Type</p>
                  <p className="font-medium">{bookingToPrint.boardingType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium">{bookingToPrint._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in Date</p>
                  <p className="font-medium">{formatDate(bookingToPrint.checkInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out Date</p>
                  <p className="font-medium">{formatDate(bookingToPrint.checkOutDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">${bookingToPrint.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium">{formatDate(bookingToPrint.createdAt)}</p>
                </div>
              </div>
              
              {bookingToPrint.additionalServices && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Additional Services</p>
                  <p className="font-medium">{bookingToPrint.additionalServices}</p>
                </div>
              )}
              
              {bookingToPrint.specialNotes && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Special Notes</p>
                  <p className="mt-1 text-gray-700">{bookingToPrint.specialNotes}</p>
                </div>
              )}
              
              <div className="border-t pt-4 mt-8 text-center text-sm text-gray-500">
                <p>This is a computer generated report. No signature required.</p>
                <p>Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 40px;
            }
            button {
              display: none !important;
            }
            @page {
              size: auto;
              margin: 20mm;
            }
          }
        `}
      </style>
    </div>
  );
};
       
export default BookingHistory;