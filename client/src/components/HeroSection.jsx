import React from "react";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white transition-all">

      <svg
        viewBox="0 0 209 59"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-[200px] h-[60px] mb-4"
      >
        <path
          d="M4.74438 7.70565C69.7006 -1.18799 136.097 -2.38304 203.934 4.1205C207.178 4.48495 209.422 7.14626 208.933 10.0534C206.793 23.6481 205.415 36.5704 204.801 48.8204C204.756 51.3291 202.246 53.5582 199.213 53.7955C136.093 59.7623 74.1922 60.5985 13.5091 56.3043C10.5653 56.0924 7.84371 53.7277 7.42158 51.0325C5.20725 38.2627 2.76333 25.6511 0.0898448 13.1978C-0.465589 10.5873 1.61173 8.1379 4.73327 7.70565"
          fill="#ffc224"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="28"
          fontFamily="Poppins, sans-serif"
          fill="white"
          fontWeight="bold"
        >
          Study Desk
        </text>
      </svg>

      <h1 className="text-4xl md:text-5xl  font-extrabold text-[#16103F] mb-2">
        Study Desk
      </h1>

      {/* Guide Subheading with Typewriter Effect */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 h-10">
        <Typewriter
          words={[
            "Guide",
            "AI Teacher",
            "Career Mentor",
            "Skill Booster",
            "Instructor",
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={80}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </h2>
    </div>
  );
};

export default HeroSection;
