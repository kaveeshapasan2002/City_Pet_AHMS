import React, { useState } from 'react';
import axios from 'axios'; // Or use fetch if you prefer

const BookingPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    petId: '', // Add this if you need to link to specific pets
    boardingType: '',
    checkIn: '',
    checkOut: '',
    specialNotes: '',
    additionalServices: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const boardingOptions = [
    { id: 'standard', label: 'Standard' },
    { id: 'deluxe', label: 'Deluxe' },
    { id: 'premium', label: 'Premium' },
  ];

  const additionalServicesOptions = [
    { value: '', label: 'Select a service' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'relaxation', label: 'Relaxation Treatments' },
    { value: 'exercise', label: 'Exercise' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get JWT token from local storage (or wherever you store it)
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to book a boarding');
      }
      
      // Send booking data to backend
      const response = await axios.post('/api/boarding/book', formData, {
        headers: {
          'Authorization': `Bearer {token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Show success message
      setSuccess('Booking created successfully! Our staff will review your request.');
      
      // Reset form
      setFormData({
        petId: '',
        boardingType: '',
        checkIn: '',
        checkOut: '',
        specialNotes: '',
        additionalServices: '',
      });
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Book Your Stay</h2>
        
        {/* Show error message if any */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Show success message if booking was successful */}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet ID field - If needed */}
          {/* <div>
            <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-1">
              Pet ID
            </label>
            <input
              type="text"
              id="petId"
              name="petId"
              value={formData.petId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div> */}
          
          {/* Boarding Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Boarding Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {boardingOptions.map(option => (
                <div
                  key={option.id}
                  className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                    formData.boardingType === option.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setFormData({
                    ...formData,
                    boardingType: option.id
                  })}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Date */}
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Additional Services Dropdown */}
          <div>
            <label htmlFor="additionalServices" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Services
            </label>
            <select
              id="additionalServices"
              name="additionalServices"
              value={formData.additionalServices}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {additionalServicesOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Special Notes */}
          <div>
            <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Special Notes
            </label>
            <textarea
              id="specialNotes"
              name="specialNotes"
              value={formData.specialNotes}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requests or notes for your stay..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;