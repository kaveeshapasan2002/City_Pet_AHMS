import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaPaw, FaCalendarPlus, FaHotel } from 'react-icons/fa';

const Dashboard = () => {
  const { isAuth, user } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Dashboard Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Dashboard
            </h1>
           
         
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 animate-slide-up">
              Welcome, {user?.name}!
            </h2>
            <p className="text-gray-600 text-lg">
              You are logged in as a <span className="font-medium text-blue-600">{user?.role}</span>.
            </p>
          </div>

          {/* Account Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg animate-slide-up">
            <h3 className="font-semibold text-xl text-blue-800 mb-4 flex items-center">
              <FaUser className="mr-2" /> Account Information
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <FaUser className="mr-3 text-blue-500" />
                <span>
                  <strong>Name:</strong> {user?.name}
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-500" />
                <span>
                  <strong>Email:</strong> {user?.email}
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-500" />
                <span>
                  <strong>Phone:</strong> {user?.phonenumber}
                </span>
              </li>
              <li className="flex items-center">
                <FaPaw className="mr-3 text-blue-500" />
                <span>
                  <strong>Role:</strong> {user?.role}
                </span>
              </li>
            </ul>
          </div>

          {/* Veterinarian Buttons Section */}
          {user?.role === 'Veterinarian' && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/addpet"
                className="relative px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center group animate-bounce"
              >
                <FaPaw className="mr-2 group-hover:animate-spin" />
                Add Pet
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                to="/petdetails"
                className="relative px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center group animate-bounce delay-150"
              >
                <FaPaw className="mr-2 group-hover:animate-spin" />
                View Pets
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          )}
        </div>

        {/* Pet Owner Section */}
        {user?.role === 'Pet Owner' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 animate-slide-up">
                Pet Care Services
              </h3>
              <img
                src="https://images.unsplash.com/photo-1601758064955-6c1e4a4d2e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Pet Care"
                className="w-12 h-12 rounded-full border-2 border-blue-200"
              />
            </div>

            {/* Pet Image and Call to Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Happy Pet"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500 animate-slide-up"
                />
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-40 animate-pulse delay-150"></div>
              </div>

              <div className="text-center md:text-left animate-fade-in">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Take Care of Your Pet
                </h4>
                <p className="text-gray-600 mb-6">
                  Schedule an appointment or book a boarding service for your pet today. We ensure they get the best care possible!
                </p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <Link
                    to="/addappointment"
                    className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center group animate-bounce"
                  >
                    <FaCalendarPlus className="mr-2 group-hover:animate-spin" />
                    Schedule Appointment
                    <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                  <Link
                    to="/pet-boarding"
                    className="relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center group animate-bounce delay-150"
                  >
                    <FaHotel className="mr-2 group-hover:animate-spin" />
                    Pet Boarding
                    <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
