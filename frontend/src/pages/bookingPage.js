import React, { useState } from 'react';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    boardingType: '',
    checkIn: '',
    checkOut: '',
    specialNotes: '',
    additionalServices: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically call an API to submit the booking
  };

  //form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Book Your Stay</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;