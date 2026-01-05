import React from "react";
import { FaUser, FaQuestion, FaClock, FaCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const WelcomeCard = () => {
  const { user } = useAuth();

  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error("Login required");
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 flex flex-col gap-4 mx-10 my-5">
      {/* Welcome Row */}
      <div className="flex items-center text-2xl font-medium space-x-3">
        <FaUser className="text-3xl" />
        <p>
          Welcome to <span className="font-semibold">Study Desk</span>,
          {user ? (
            <>
              <span className="hidden md:inline">
                {" "}
                {user?.name?.split(" ")[1]} Jii
              </span>
              <span className="md:hidden "> {user?.name?.split(" ")[0]}</span>
            </>
          ) : (
            <span> Guest</span>
          )}
        </p>
      </div>

      {/* Options Row */}
      <div className="md:flex block gap-8 text-gray-800 text-lg font-medium px-2">
        {/* Always accessible */}
        <NavLink
          to="/dashboard/question"
          className={({ isActive }) =>
            `flex border-b border-gray-300 md:border-none items-center gap-2 md:p-0 p-2 cursor-pointer transition ${isActive ? "text-blue-600" : "hover:text-blue-600"
            }`
          }
        >
          <FaQuestion />
          <span>Question</span>
        </NavLink>

        {/* Protected - History */}
        <NavLink
          to="/dashboard/history"
          onClick={handleProtectedClick}
          className={({ isActive }) =>
            `flex items-center border-b border-gray-300 md:border-none md:p-0 p-2 gap-2 cursor-pointer transition ${isActive ? "text-blue-600" : "hover:text-blue-600"
            }`
          }
        >
          <FaClock />
          <span>Chat History</span>
        </NavLink>

        {/* Protected - Settings */}
        <NavLink
          to="/dashboard/settings"
          onClick={handleProtectedClick}
          className={({ isActive }) =>
            `flex items-center border-b border-gray-300 md:border-none md:p-0 p-2 gap-2 cursor-pointer transition ${isActive ? "text-blue-600" : "hover:text-blue-600"
            }`
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default WelcomeCard;
