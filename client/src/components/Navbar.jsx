import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Button from "./Button";
import { TbCategory } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDashboard =
    location.pathname === "/dashboard/question" ||
    location.pathname === "/dashboard/settings" ||
    location.pathname === "/dashboard/history";

  const goto = (go) => {
    navigate(go);
  };
  const handleMoblieLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-300">
      {/* Main Navbar with Glassmorphism */}
      <div className="flex justify-between items-center px-6 md:px-12 py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="hidden md:flex items-center gap-12">
          <img
            src="/study_desk_logo.png"
            alt="Study Desk Logo"
            className="h-10 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="flex gap-8 text-sm font-semibold tracking-wide text-gray-800 uppercase">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `relative py-1 transition-colors hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full ${isActive ? 'text-blue-600 after:w-full' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="#"
              className="relative py-1 transition-colors hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              Resources
            </NavLink>
          </div>
        </div>

        {!isDashboard ? (
          <div className="hidden md:flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {user ? (
              <div className="hidden md:flex justify-center items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Hi, <span className="text-gray-900 font-bold">{user?.name?.split(" ")[0]}</span></span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 border-2 border-red-500/20 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex justify-center gap-4">
                <button
                  onClick={() => goto("/sign-up")}
                  className="px-5 py-2 text-gray-700 font-bold hover:text-blue-600 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => goto("/login")}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hamburger for sm screens */}
        <div className="md:hidden flex items-center justify-between w-full">
          <img
            src="/study_desk_logo.png"
            alt="Study Desk Logo"
            className="h-9"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <TbCategory size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Right Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-white z-50 shadow-2xl transform ${isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <img
            src="/study_desk_logo.png"
            alt="Study Desk Logo"
            className="h-10"
          />
          <FaTimes
            size={22}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-2 p-6">
          {[
            { name: "Home", path: "/" },
            { name: "Dashboard", path: "/dashboard" },
            { name: "Resources", path: "#" }
          ].map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {isDashboard ? (
          <>
            {user ? (
              <>
                <div className="flex flex-col gap-3 px-6 mt-4">
                  <Button
                    title={"Logout"}
                    type={"button"}
                    onClickfunc={handleMoblieLogout}
                  />
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="flex flex-col gap-3 px-6 mt-4">
                  <Button
                    title={"Sign Up"}
                    type={"button"}
                    onClickfunc={() => goto("/sign-up")}
                  />
                  <Button
                    title={"Sign In"}
                    type={"button"}
                    onClickfunc={() => goto("/login")}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3 px-6 mt-4">
            <Button
              title={"Get Started"}
              type={"button"}
              onClickfunc={() => navigate("/login")}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
        ></div>
      )}
    </header>
  );
}
