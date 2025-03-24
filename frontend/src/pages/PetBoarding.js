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
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">About Our Boarding Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Standard</h3>
                <p className="text-blue-700 mb-2">$30/day</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Basic comfortable kennel</li>
                  <li>• Regular feeding schedule</li>
                  <li>• Daily walks</li>
                  <li>• Basic monitoring</li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-2">Deluxe</h3>
                <p className="text-indigo-700 mb-2">$50/day</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Larger, more comfortable space</li>
                  <li>• Premium food options</li>
                  <li>• Extended exercise time</li>
                  <li>• Daily grooming</li>
                  <li>• Bedtime treats</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-2">Premium</h3>
                <p className="text-purple-700 mb-2">$80/day</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Luxury suite with bed</li>
                  <li>• Personalized care plan</li>
                  <li>• Multiple play sessions</li>
                  <li>• Specialized diet preparation</li>
                  <li>• Regular photo updates</li>
                  <li>• Premium treats & toys</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PetBoarding;
