// src/components/auth/OtpVerification.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { verifyOtp } from '../../api/auth';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyOtp({ email, otp });
      navigate('/login', { state: { message: 'Account verified successfully! You can now login.' } });
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <div className="text-center py-8">Please register first to receive an OTP.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <div className="mb-6 text-center">
        <p>We've sent a 6-digit verification code to</p>
        <p className="font-semibold">{email}</p>
        <p className="text-sm text-gray-500 mt-2">Please check your email and enter the code below.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Enter OTP"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm">
          Didn't receive the code?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Try again
          </a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;