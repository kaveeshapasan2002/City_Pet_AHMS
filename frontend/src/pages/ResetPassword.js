// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { resetPassword } from '../api/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Get resetToken from location state
    if (location.state?.resetToken) {
      setResetToken(location.state.resetToken);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        resetToken,
        newPassword: formData.newPassword
      });
      
      setSuccess(response.message);
      
      // Navigate to login after successful reset
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful. Please login with your new password.' } 
        });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-gray-600">
          Please enter your new password.
        </p>
        
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          minLength={6}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
          minLength={6}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;