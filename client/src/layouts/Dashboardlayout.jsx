import React from "react";
import WelcomeCard from "../components/WelcomeCard";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboardlayout = () => {
  return (
    <div className="flex min-h-screen bg-[#fcfcfd] dark:bg-black">
      <Sidebar />
      <main className="flex-1 w-full lg:max-w-[calc(100vw-320px)] overflow-x-hidden">
        <WelcomeCard />
        <div className="relative p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboardlayout;
