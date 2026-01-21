import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Button from "../components/Button";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({}); // clear previous field errors

    const dataToSend = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
      const response = await axios.post("/api/auth/register", dataToSend);
      toast.success(response.data.message || "Registered successfully!");

      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const backendErrors = error?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const formattedErrors = {};
        backendErrors.forEach((err) => {
          if (err.path && err.msg) {
            formattedErrors[err.path] = err.msg;
          }
        });
        setErrors(formattedErrors);
      } else {
        const errorMsg = error?.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:p-12 h-fit bg-white rounded-[2.5rem] shadow-2xl shadow-brand-blue/5 border border-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
        Create Your Account
      </h2>
      <p className="text-gray-500 mb-8 font-medium text-lg tracking-tight leading-relaxed">
        Ready to join the party? <br />
        We just need a few details to get you started.
      </p>

      <div className="flex items-center my-8">
        <hr className="flex-grow border-gray-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
            />
            {errors.firstName && <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
            />
            {errors.lastName && <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
          />
          {errors.email && <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.email}</p>}
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all pr-12"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-brand-blue transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.password && <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.password}</p>}
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
          <div className="relative">
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all pr-12"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-brand-blue transition-colors"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up →"}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500 font-medium">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-blue font-black hover:underline ml-1">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
