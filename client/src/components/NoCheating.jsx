import React from "react";
import { Typewriter } from "react-simple-typewriter";

const NoCheating = () => {
  return (
    <div className="mx-8 my-5 mb-20">
      <div className="flex md:flex-row flex-col w-full justify-between items-center bg-gray-100 p-4 rounded-xl">
        <img src="h7_cta_img.png" alt="image" className="md:h-28 mb-5 md:mb-0 md:px-10" />

        <div className="md:w-[28rem] w-72">
          <h4 className="md:text-3xl text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
            It's not cheating...
          </h4>
          <p className="md:text-lg text-gray-600 mb-2 md:mb-0 h-12 md:h-fit">
            <Typewriter
                      words={[
                        "You're just learning smarter than everyone else"
                      ]}
                      loop={0}
                      cursor
                      cursorStyle="|"
                      typeSpeed={80}
                      deleteSpeed={50}
                      delaySpeed={1500}
                    />
          </p>
        </div>

        <button className="bg-[#0052cc] hover:bg-[#0041a8] text-white font-semibold px-6 py-2 rounded-full m-2 shadow-md relative custom-boxShadow mr-4">
          Try now →
          <span className="absolute -bottom-1 -right-1 bg-[#001b66] w-full h-full rounded-full -z-10 translate-x-1 translate-y-1"></span>
        </button>
      </div>
    </div>
  );
};

export default NoCheating;
