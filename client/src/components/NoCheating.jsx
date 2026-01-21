import React from "react";
import { Typewriter } from "react-simple-typewriter";

const NoCheating = () => {
  return (
    <div className="mx-8 my-10 mb-20 animate-fadeIn">
      <div className="flex md:flex-row flex-col w-full justify-between items-center bg-gradient-to-br from-brand-blue/5 to-transparent p-6 md:p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
        <img
          src="h7_cta_img.png"
          alt="Learning Smarter"
          className="md:h-32 mb-6 md:mb-0 md:px-10 drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />

        <div className="md:w-[32rem] w-full text-center md:text-left">
          <h4 className="md:text-4xl text-2xl font-black text-gray-900 mb-3 tracking-tight">
            It's not cheating...
          </h4>
          <p className="md:text-xl text-gray-600 font-medium h-12 md:h-fit tracking-tight">
            <Typewriter
              words={[
                "You're just learning smarter than everyone else."
              ]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </p>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
        >
          Try now
          <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default NoCheating;
