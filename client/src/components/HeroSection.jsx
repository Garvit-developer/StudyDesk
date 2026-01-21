import React from "react";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white transition-all animate-fadeIn">
      <div className="relative group cursor-default">
        <svg
          viewBox="0 0 209 59"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-[180px] h-[54px] mb-6 transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 drop-shadow-sm"
        >
          <path
            d="M4.74438 7.70565C69.7006 -1.18799 136.097 -2.38304 203.934 4.1205C207.178 4.48495 209.422 7.14626 208.933 10.0534C206.793 23.6481 205.415 36.5704 204.801 48.8204C204.756 51.3291 202.246 53.5582 199.213 53.7955C136.093 59.7623 74.1922 60.5985 13.5091 56.3043C10.5653 56.0924 7.84371 53.7277 7.42158 51.0325C5.20725 38.2627 2.76333 25.6511 0.0898448 13.1978C-0.465589 10.5873 1.61173 8.1379 4.73327 7.70565"
            fill="var(--color-brand-yellow)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="24"
            fontFamily="Poppins, sans-serif"
            fill="black"
            fontWeight="900"
            className="tracking-tight"
          >
            Study Desk
          </text>
        </svg>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter">
        Study Desk
      </h1>

      {/* Guide Subheading with Typewriter Effect */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-brand-blue min-h-[1.2em] tracking-tight">
        <Typewriter
          words={[
            "Your AI Guide",
            "An AI Teacher",
            "Your Career Mentor",
            "A Skill Booster",
            "Expert Instructor",
          ]}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={40}
          delaySpeed={2000}
        />
      </h2>
    </div>
  );
};

export default HeroSection;
