// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await forgotPassword(email);
      setSuccess(response.message);
      // Navigate to OTP verification with email in state
      setTimeout(() => {
        navigate('/verify-reset-otp', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-gray-600">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset OTP'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Remember your password?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;