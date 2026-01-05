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
  const { setUser ,fetchUser } = useAuth();

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
                console.log("test",res.data);

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
    <div className="p-8 h-fit bg-gray-100 rounded-lg shadow border border-gray-200">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Welcome back!
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Hey there! Ready to log in? Just enter your username and password below
        and you'll be back in action in no time.
      </p>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-2 text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-3 bg-white outline-none"
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-[10px]">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <label className="block mb-2 text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 rounded p-3 bg-white pr-10 outline-none"
          />
          <div
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </div>
          {errors.password && (
            <p className="text-red-500 mt-1 text-[10px]">{errors.password}</p>
          )}
        </div>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline text-sm mb-4 block text-end"
        >
          Forgot Password?
        </Link>

        <Button type="submit" title="Sign In →" loading={loading} />
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
