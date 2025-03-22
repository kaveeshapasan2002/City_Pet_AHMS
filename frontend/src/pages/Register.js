// src/pages/Register.js
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;