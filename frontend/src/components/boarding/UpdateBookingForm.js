// src/components/boarding/UpdateBookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, updateBooking } from '../../api/boarding';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const UpdateBookingForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    petName: '',
    boardingType: 'Standard',
    checkInDate: '',
    checkOutDate: '',
    additionalServices: '',
    specialNotes: '',
  });
  
  // Fetch booking data when component mounts
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const booking = await getBookingById(bookingId);
        
        // Populate form with booking data
        setFormData({
          petName: booking.petName,
          boardingType: booking.boardingType,
          checkInDate: new Date(booking.checkInDate).toISOString().split('T')[0],
          checkOutDate: new Date(booking.checkOutDate).toISOString().split('T')[0],
          additionalServices: booking.additionalServices || '',
          specialNotes: booking.specialNotes || '',
        });
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
  
  const handleBoardingTypeSelect = (type) => {
    setFormData({ ...formData, boardingType: type });
  };
  


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      // Validate dates
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const today = new Date();
      
      if (checkIn < today) {
        throw { message: 'Check-in date cannot be in the past' };
      }
      
      if (checkOut <= checkIn) {
        throw { message: 'Check-out date must be after check-in date' };
      }
      
      await updateBooking(bookingId, formData);
      
      setMessage('Booking updated successfully!');
      setMessageType('success');
      
      // Navigate back to bookings after a short delay
      setTimeout(() => {
        navigate('/pet-boarding');
      }, 1500);
    } catch (error) {
      setMessage(error.message || 'Failed to update booking');
      setMessageType('error');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Calculate price preview
  const calculatePrice = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      return 0;
    }
    
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const pricePerDay = {
      'Standard': 30,
      'Deluxe': 50,
      'Premium': 80
    };
    
    const servicesPrices = {
      'Grooming': 40,
      'Training': 50,
      'Special Diet': 20,
      'Health Check': 35,
      'Playtime': 15
    };
    
    let totalPrice = pricePerDay[formData.boardingType] * days;
    
    if (formData.additionalServices && servicesPrices[formData.additionalServices]) {
      totalPrice += servicesPrices[formData.additionalServices];
    }
    
    return totalPrice;
  };
  
  const estimatedPrice = calculatePrice();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="text-center py-4">Loading booking details...</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Your Booking</h2>
            
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
                <Input
                  label="Pet Name"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  placeholder="Enter your pet's name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Boarding Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 border rounded-md ${
                      formData.boardingType === 'Standard'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleBoardingTypeSelect('Standard')}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 border rounded-md ${
                      formData.boardingType === 'Deluxe'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleBoardingTypeSelect('Deluxe')}
                  >
                    Deluxe
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 border rounded-md ${
                      formData.boardingType === 'Premium'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleBoardingTypeSelect('Premium')}
                  >
                    Premium
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Additional Services</label>
                <select
                  name="additionalServices"
                  value={formData.additionalServices}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a service (optional)</option>
                  <option value="Grooming">Grooming ($40)</option>
                  <option value="Training">Training ($50)</option>
                  <option value="Special Diet">Special Diet ($20)</option>
                  <option value="Health Check">Health Check ($35)</option>
                  <option value="Playtime">Extra Playtime ($15)</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Special Notes</label>
                <textarea
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Any special requests or notes for your stay..."
                ></textarea>
              </div>
              
              {estimatedPrice > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-1">Estimated Price</h3>
                  <p className="text-blue-700 text-xl font-bold">${estimatedPrice.toFixed(2)}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  className="w-1/2 py-3 text-lg bg-gray-500 hover:bg-gray-600" 
                  onClick={() => navigate('/pet-boarding')}
                >
                  Delete
                </Button>
                <Button 
                  type="submit" 
                  className="w-1/2 py-3 text-lg" 
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update Booking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookingForm;