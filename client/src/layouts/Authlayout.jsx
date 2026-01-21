import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Authlayout = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-6 flex justify-between items-center" >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <img
            src="/study_desk_logo.png"
            alt="Study Desk Logo"
            className="h-10 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-2xl font-black bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            Study Desk
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl items-center gap-12">
          <div className="hidden md:flex flex-col items-center justify-center p-10 animate-fadeIn">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
              <img
                src="aiPower.jpg"
                alt="AI Powered Education"
                className="relative w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Master Your Learning</h3>
              <p className="text-gray-500 font-medium max-w-sm">Unlock the potential of AI-driven education with Study Desk.</p>
            </div>
          </div>
          <div className="w-full animate-fadeIn transition-all duration-500">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authlayout;
