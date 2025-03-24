// src/pages/PetBoarding.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/boarding/BookingForm';
import BookingHistory from '../components/boarding/BookingHistory';

const PetBoarding = () => {
  const { isAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'booking'
  const [refreshHistory, setRefreshHistory] = useState(false);
  
  // Redirect if not authenticated
  if (!isAuth) {                                  //what is isAuth
    return <Navigate to="/login" />;
  }
  
  // Only pet owners can access this page
  if (user && user.role !== 'Pet Owner') {                //what is this role base
    return <Navigate to="/dashboard" />;
  }
  
  const handleSuccessfulBooking = () => {
    setActiveTab('history');
    setRefreshHistory(prev => !prev); // Toggle to trigger useEffect in BookingHistory
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Pet Boarding Service</h1>
          
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 px-6 text-center ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Your Bookings
              </button>
              <button
                className={`flex-1 py-3 px-6 text-center ${
                  activeTab === 'booking'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('booking')}
              >
                Make a Booking
              </button>
            </div>
          </div>
          
          {activeTab === 'history' ? (
            <BookingHistory refresh={refreshHistory} />
          ) : (
            <BookingForm onSuccess={handleSuccessfulBooking} />
          )}
          
          {/* Information section */}

        </div>
      </div>
    </div>
  );
};

export default PetBoarding;
