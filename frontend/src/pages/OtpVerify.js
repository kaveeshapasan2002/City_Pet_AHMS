// src/pages/OtpVerify.js
import React from 'react';
import OtpVerification from '../components/auth/OtpVerification';

const OtpVerify = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <OtpVerification />
      </div>
    </div>
  );
};

export default OtpVerify;