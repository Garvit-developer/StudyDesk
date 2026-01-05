import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem('resetEmail', location.state.email);
      startTimer();
    } else {
      const storedEmail = localStorage.getItem('resetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
        startTimer();
      } else {
        navigate('/forgot-password');
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  const startTimer = () => {
    setTimer(45);
    setResendDisabled(true);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp: otpString });

      if (response.data.message && response.data.message.toLowerCase().includes('otp verified')) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/reset-password', { state: { email, otp: otpString } });
        }, 2000);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });

      if (response.data.message && response.data.message.toLowerCase().includes('otp sent')) {
        toast.success('New OTP sent successfully!');
        setOtp(['', '', '', '', '', '']);
        startTimer();
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleVerifyOtp}
        className="w-full max-w-md  bg-gray-100 rounded-lg  border border-gray-300 shadow-lg  p-8 space-y-6"
      >

        {/* Title & Subtitle */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Enter OTP</h2>
          <p className="text-sm text-gray-500 mt-1">
            We've sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 border bg-white border-gray-300 rounded-md text-center text-lg font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP + Timer */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Didn't receive code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={resendDisabled || loading}
            >
              Resend Code
            </button>
          </p>
          {resendDisabled && (
            <span className="text-red-500 font-semibold">
              00:{timer.toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default EmailVerification;
