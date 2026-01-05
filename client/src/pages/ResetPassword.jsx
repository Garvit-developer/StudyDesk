import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email);
      setOtp(location.state.otp);
      localStorage.setItem('resetEmail', location.state.email);
      localStorage.setItem('resetOtp', location.state.otp);
      localStorage.setItem('otpTimestamp', Date.now().toString());
    } else {
      const storedEmail = localStorage.getItem('resetEmail');
      const storedOtp = localStorage.getItem('resetOtp');
      const otpTimestamp = localStorage.getItem('otpTimestamp');
      if (storedEmail && storedOtp && otpTimestamp) {
        if (Date.now() - parseInt(otpTimestamp) > 10 * 60 * 1000) {
          toast.error('OTP has expired. Please request a new one.');
          localStorage.clear();
          navigate('/email-verification');
        } else {
          setEmail(storedEmail);
          setOtp(storedOtp);
        }
      } else {
        toast.error('No valid email or OTP found. Please verify your email first.');
        navigate('/login');
      }
    }
  }, [location, navigate]);

  const validateNewPassword = (password) => {
    if (!password) {
      setNewPasswordError('');
      return false;
    }
    if (password.length < 6) {
      setNewPasswordError('Password must be at least 6 characters');
      return false;
    }
    setNewPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPass) => {
    if (!confirmPass) {
      setConfirmPasswordError('');
      return false;
    }
    if (newPassword && confirmPass !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validateNewPassword(value);
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || isNaN(otp)) {
      toast.error('Invalid OTP format. Please request a new OTP.');
      localStorage.clear();
      navigate('/email-verification');
      return;
    }

    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    if (!isNewPasswordValid || !isConfirmPasswordValid) return;

    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      const message = response.data.message?.toLowerCase() || '';
      if (
        response.data.success === true ||
        message.includes('reset') ||
        message.includes('updated') ||
        message.includes('success')
      ) {
        toast.success('Your new password has been successfully saved!');
        localStorage.clear();
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Password reset failed. Please try again.';
      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes('invalid otp') || errorMessage.toLowerCase().includes('otp has expired')) {
        localStorage.clear();
        navigate('/email-verification');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-gray-100   border border-gray-300 shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h5 className="text-xl font-semibold mb-1">Reset Password</h5>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleResetPassword}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                 {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {newPasswordError && <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password again"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
               {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <Button
              type="submit"
              title="Reset Password"
              loading={loading}
              customStyle="w-full"
            />

          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Return to{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
