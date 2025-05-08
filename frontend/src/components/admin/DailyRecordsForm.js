// src/components/admin/DailyRecordsForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../../api/boarding';
import { addDailyRecord } from '../../api/admin';
import Alert from '../common/Alert';
import Button from '../common/Button';

const DailyRecordsForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    feedingNotes: '',
    activityNotes: '',
    healthNotes: '',
    behaviorNotes: '',
    photos: []
  });
  
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        setMessage(error.message || 'Failed to fetch booking details');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDailyRecord(bookingId, formData);
      setMessage('Daily record added successfully');
      setMessageType('success');
      // Reset form fields except date
      setFormData({
        ...formData,
        feedingNotes: '',
        activityNotes: '',
        healthNotes: '',
        behaviorNotes: '',
        photos: []
      });
      // Optional: Navigate back to admin boarding management
      setTimeout(() => {
        navigate('/admin/boarding');
      }, 1500);
    } catch (error) {
      setMessage(error.message || 'Failed to add daily record');
      setMessageType('error');
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">Loading booking details...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Add Daily Record</h2>
      <div className="mb-4">
        <p><span className="font-medium">Pet:</span> {booking?.petName}</p>
        <p><span className="font-medium">Owner:</span> {booking?.user?.name}</p>
        <p><span className="font-medium">Boarding Type:</span> {booking?.boardingType}</p>
      </div>
      
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage('')}
          className="mb-4" 
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Feeding Notes</label>
          <textarea
            name="feedingNotes"
            value={formData.feedingNotes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Food intake, appetite, etc."
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Activity Notes</label>
          <textarea
            name="activityNotes"
            value={formData.activityNotes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Walks, playtime, exercise, etc."
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Health Notes</label>
          <textarea
            name="healthNotes"
            value={formData.healthNotes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Medication, physical condition, etc."
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Behavior Notes</label>
          <textarea
            name="behaviorNotes"
            value={formData.behaviorNotes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Mood, interactions, unusual behaviors, etc."
          ></textarea>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            type="button" 
            className="w-1/2 py-2 bg-gray-500 hover:bg-gray-600" 
            onClick={() => navigate('/admin/boarding')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="w-1/2 py-2" 
          >
            Save Record
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DailyRecordsForm;