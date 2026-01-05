import React from "react";
import WelcomeCard from "../components/WelcomeCard";
import { Outlet } from "react-router-dom";

const Dashboardlayout = () => {
  return (
    <>
      <WelcomeCard />
      <Outlet />
    </>
  );
};

export default Dashboardlayout;
