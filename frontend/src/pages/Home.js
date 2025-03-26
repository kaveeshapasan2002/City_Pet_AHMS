// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuth } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Pet Hospital</h1>
            <p className="text-xl mb-6">Your pet's health is our priority.</p>
            
            {!isAuth && (
              <div className="space-x-4">
                <Link 
                  to="/login" 
                  className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 border border-white"
                >
                  Register Now
                </Link>
              </div>
            )}
            
            {isAuth && (
              <Link 
                to="/dashboard" 
                className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
          
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Veterinary Care</h3>
                <p className="text-gray-700">
                  We provide comprehensive veterinary care for all types of pets.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Pet Grooming</h3>
                <p className="text-gray-700">
                  Keep your pet looking their best with our grooming services.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Emergency Care</h3>
                <p className="text-gray-700">
                  24/7 emergency services for your pet's urgent needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
//