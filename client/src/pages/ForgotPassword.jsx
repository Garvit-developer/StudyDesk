import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: email,
      });

      if (response.data.message) {
        setMessage("OTP sent to your email! Please check your inbox.");
        setTimeout(() => {
          navigate("/email-verification", { state: { email: email } });
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  px-4">
      <div className="w-full max-w-md  shadow-xl    bg-gray-100 rounded-lg  border border-gray-200  p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password ?</h2>
          <p className="text-gray-500 text-sm mt-1">
            Don’t worry, we’ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="isax isax-sms-notification"></i>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white  focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("sent")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            title={ "Send OTP"}
            loading={loading}
            customStyle="w-full"
          />
        </form>

        {/* Back to login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Return to{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
