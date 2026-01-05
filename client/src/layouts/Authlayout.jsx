import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Authlayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="px-5 py-2 flex justify-center md:block " >
        <img
          src="/study_desk_logo.png"
          alt="company_logo"
          className="object-fit cursor-pointer h-12"
          onClick={() => navigate("/")}
        />
      </header>

      <div className="flex items-center justify-center bg-white px-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white overflow-hidden">
          <div className="flex items-center justify-center p-10">
            <img
              src="aiPower.jpg"
              alt="secure signup"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg "
            />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Authlayout;
