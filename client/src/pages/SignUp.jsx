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
    <div className="p-8 pb-5 h-fit bg-gray-100 rounded-lg shadow border border-gray-200">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Create Your Account
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Hey there! Ready to join the party? We just need a few details from you
        to get started. Let’s do this!
      </p>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded p-3 bg-white"
            />
            {errors.firstName && <p className="text-red-500 mt-1 text-[10px]">{errors.firstName}</p>}
          </div>
          <div className="w-1/2">
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded p-3 bg-white"
            />
            {errors.lastName && <p className="text-red-500 mt-1 text-[10px]">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded p-3 bg-white"
          />
          {errors.email && <p className="text-red-500 mt-1 text-[10px]">{errors.email}</p>}
        </div>

        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded p-3 bg-white pr-10"
          />
          <div
            className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </div>
          {errors.password && <p className="text-red-500 mt-1 text-[10px]">{errors.password}</p>}
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded p-3 bg-white pr-10"
          />
          <div
            className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </div>
          {errors.confirmPassword && <p className="text-red-500 mt-1 text-[10px]">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" title="Sign Up →" loading={loading} />
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
