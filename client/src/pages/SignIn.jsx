import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, fetchUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email.";

    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      console.log("test", res.data);

      // Set user globally
      setUser({
        id: res.data.userId,
        email: res.data.email,
        name: res.data.name,
        profile_pic: res.data.profile_pic,
        address: res.data.address,
        mobile: res.data.mobile,
        created_at: res.data.created_at,
      });

      toast.success(res.data.message || "Login successful");
      navigate("/dashboard");

      setFormData({ email: "", password: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:p-12 h-fit bg-white rounded-[2.5rem] shadow-2xl shadow-brand-blue/5 border border-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
        Welcome back!
      </h2>
      <p className="text-gray-500 mb-8 font-medium text-lg tracking-tight leading-relaxed">
        Ready to continue your learning journey? <br />
        Enter your details below to get back in action.
      </p>

      <div className="flex items-center my-8">
        <hr className="flex-grow border-gray-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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
          {errors.password && (
            <p className="text-red-500 mt-1 text-xs font-bold font-mono uppercase tracking-tight ml-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-brand-blue font-bold hover:text-brand-blue-dark transition-colors text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In →"}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500 font-medium">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-brand-blue font-black hover:underline ml-1">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
