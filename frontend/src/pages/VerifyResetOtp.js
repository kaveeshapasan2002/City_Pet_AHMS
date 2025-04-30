// src/pages/VerifyResetOtp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { verifyResetOtp } from '../api/auth';

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // Get email from location state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await verifyResetOtp({ email, otp });
      setSuccess(response.message);
      
      // Navigate to reset password with resetToken
      setTimeout(() => {
        navigate('/reset-password', { 
          state: { 
            email, 
            resetToken: response.resetToken 
          }
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-gray-600">
          Please enter the 6-digit OTP sent to your email address.
        </p>
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={!!location.state?.email}
        />
        
        <Input
          label="OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
          maxLength={6}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Didn't receive the OTP?{' '}
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyResetOtp;