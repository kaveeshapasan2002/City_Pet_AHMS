// src/pages/Login.js
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;