import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai";

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    profile_pic: "",
    created_at: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const [firstname = "", ...rest] = user.name?.split(" ") || [];
      const lastname = rest.join(" ");
      setProfile({
        firstname,
        lastname,
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
        profile_pic: user.profile_pic || "",
        created_at: user.created_at || "",
      });
      setImage(user.profile_pic || null);
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));

      try {
        await uploadImageToServer(file);

        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleDeleteProfilePic = async () => {
    try {
      await axios.delete("/api/auth/delete-profile-pic", {
        withCredentials: true,
      });
      toast.success("Profile picture deleted successfully");
      setImage(null);
      setImageFile(null);
      fileInputRef.current.value = null;

      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Enter a valid email address";
      }
      if (name === "mobile") {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value))
          error = "Enter a valid 10-digit mobile number";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSave = async () => {
    let newErrors = {};
    Object.keys(profile).forEach((key) => {
      if (
        ["firstname", "lastname", "email", "mobile", "address"].includes(key)
      ) {
        const error = validateField(key, profile[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatedData = {
        firstname: profile.firstname.trim(),
        lastname: profile.lastname.trim(),
        email: profile.email,
        address: profile.address,
        mobile: profile.mobile,
      };

      await axios.put("/api/auth/update-profile", updatedData, {
        withCredentials: true,
      });
      toast.success("Profile updated successfully");
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(
        "Profile update failed:",
        err.response?.data || err.message
      );
    }
  };

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profile_pic", file);

      await axios.put("/api/auth/update-profile-pic", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/auth/delete-account", { withCredentials: true });
      toast.success("Account deleted permanently");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(
        "Account deletion failed:",
        err.response?.data || err.message
      );
      toast.error("Failed to delete account");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white py-4 sm:py-8 px-2 sm:px-4">
      <div className="relative w-full max-w-7xl">
        {/* Background Banner */}
        <div
          className="h-32 sm:h-48 md:h-60 lg:h-70 rounded-t-xl bg-cover bg-center"
          style={{ backgroundImage: "url('/student-pg.png')" }}
        ></div>

        {/* Profile Section */}
        <div className="bg-[#4b44e8] text-white rounded-b-xl shadow-md px-3 sm:px-6 py-4 sm:py-6 relative">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-16 sm:-mt-20 mb-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                <img
                  src={
                    image !== null
                      ? `http://localhost:7000/${image}`
                      : "/placeholder_profile.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleUploadClick}
                className="absolute mt-16 sm:mt-20 ml-16 sm:ml-20 bg-blue-600 text-white p-1 sm:p-1.5 rounded-full shadow-md hover:scale-110 transition-transform z-0"
              >
                <FaPlus size={14} className="sm:hidden" />
                <FaPlus size={16} className="hidden sm:block" />
              </button>

              {image && (
                <button
                  onClick={handleDeleteProfilePic}
                  className="absolute mt-2 ml-16 sm:ml-20 bg-red-600 text-white p-1 sm:p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <FaTrash size={14} className="sm:hidden" />
                  <FaTrash size={16} className="hidden sm:block" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {profile.firstname} {profile.lastname}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 sm:p-2 bg-white text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100 transition"
                  title="Edit"
                >
                  <FiEdit size={14} className="sm:hidden" />
                  <FiEdit size={16} className="hidden sm:block" />
                </button>
              </div>
              <div className="space-y-1 text-sm sm:text-base md:text-lg">
                <p className="text-white/90 flex items-center justify-center gap-2 flex-wrap">
                  <MdEmail className="flex-shrink-0" />
                  <span className="break-all">{profile.email}</span>
                </p>
                <p className="text-white/90 flex items-center justify-center gap-2">
                  <MdPhone className="flex-shrink-0" />{" "}
                  {profile.mobile || "N/A"}
                </p>
                <p className="text-white/90 flex items-center justify-center gap-2 text-center">
                  <MdLocationOn className="flex-shrink-0" />
                  <span>{profile.address || "N/A"}</span>
                </p>
                <p className="text-white/90  flex items-center justify-center gap-2 text-center">
                  <AiOutlineHistory title="Account Created" className="flex-shrink-0" />
                  <span >
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>
              <Button
                title={"Delete Account Permanently"}
                type={"button"}
                customStyle={
                  "w-fit px-5 border-black text-black bg-red-500 hover:bg-[#ffc224]"
                }
                onClickfunc={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            {/* Profile Picture */}
            <div className="absolute -top-55 left-20">
              <div className="relative w-55 h-55 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                <img
                  src={
                    image !== null
                      ? `http://localhost:7000/${image}`
                      : "/placeholder_profile.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleUploadClick}
                className="absolute bottom-0 right-8 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform z-10"
              >
                <FaPlus size={20} />
              </button>

              {image && (
                <button
                  onClick={handleDeleteProfilePic}
                  className="absolute top-0 right-8 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <FaTrash size={20} />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="ml-80 mt-[-210px] flex flex-col gap-y-1">
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-bold">
                  {profile.firstname} {profile.lastname}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-white text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100 transition"
                  title="Edit"
                >
                  <FiEdit size={18} />
                </button>
              </div>
              <p className="text-[23px] text-white/90 flex items-center gap-2">
                <MdEmail /> {profile.email}
              </p>
              <p className="text-[23px] text-white/90 flex items-center gap-2">
                <MdPhone /> {profile.mobile || "N/A"}
              </p>
              <p className="text-[23px] text-white/90 flex items-center gap-2">
                <MdLocationOn /> {profile.address || "N/A"}
              </p>
              <p className="text-[23px] text-white/90 flex items-center gap-2">
                <AiOutlineHistory  title="Account Created" />{" "}
                <span className="text-lg">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </p>
              <Button
                title={"Delete Account Permanently"}
                type={"button"}
                customStyle={
                  "w-fit px-5 border-black text-black bg-red-500 hover:bg-[#ffc224]"
                }
                onClickfunc={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg md:max-w-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-4 sm:mb-6">
              Edit Profile Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "First Name", key: "firstname" },
                { label: "Last Name", key: "lastname" },
                { label: "Email", key: "email" },
                { label: "Mobile", key: "mobile" },
                { label: "Address", key: "address", fullWidth: true },
              ].map(({ label, key, fullWidth }) => (
                <div key={key} className={fullWidth ? "sm:col-span-2" : ""}>
                  <label className="text-gray-700 block mb-1 font-medium text-sm sm:text-base">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={profile[key]}
                    onChange={handleChange}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className={`w-full px-3 sm:px-4 py-2 bg-white text-gray-800 border ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 sm:px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 sm:px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This action will permanently delete your account. This cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
