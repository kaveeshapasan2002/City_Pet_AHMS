// src/components/boarding/DailyRecordsView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, getDailyRecords } from '../../api/boarding';
import Alert from '../common/Alert';
import Button from '../common/Button';

const DailyRecordsView = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
        
        const recordsData = await getDailyRecords(bookingId);
        setRecords(recordsData);
      } catch (error) {
        setMessage(error.message || 'Failed to fetch data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bookingId]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return <div className="text-center py-4">Loading records...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Daily Records</h2>
        <Button 
          onClick={() => navigate('/pet-boarding')}
          className="px-4 py-2"
        >
          Back to Bookings
        </Button>
      </div>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-lg mb-2">{booking?.petName}'s Stay</h3>
        <p><span className="font-medium">Boarding Type:</span> {booking?.boardingType}</p>
        <p><span className="font-medium">Dates:</span> {formatDate(booking?.checkInDate)} to {formatDate(booking?.checkOutDate)}</p>
      </div>
      
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}
      
      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No daily records available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div key={record._id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium">{formatDate(record.date)}</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.feedingNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Feeding</p>
                      <p className="font-medium">{record.feedingNotes}</p>
                    </div>
                  )}
                  {record.activityNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Activity</p>
                      <p className="font-medium">{record.activityNotes}</p>
                    </div>
                  )}
                  {record.healthNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Health</p>
                      <p className="font-medium">{record.healthNotes}</p>
                    </div>
                  )}
                  {record.behaviorNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Behavior</p>
                      <p className="font-medium">{record.behaviorNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyRecordsView;