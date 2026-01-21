import React, { useState, useEffect } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa6";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      quote:
        "Organize your subjects, track progress, and study smarter across all your courses. Learn efficiently, stay focused, and reach your academic goals with ease.",
      author: "Study Desk",
      rating: 5,
    },
    {
      quote:
        "This platform has completely transformed how I approach my studies. The organization tools are intuitive and the progress tracking keeps me motivated every day.",
      author: "StudyMaster",
      rating: 5,
    },
    {
      quote:
        "I've tried many study apps, but this one stands out. The focus features help me stay on track and I've seen real improvement in my academic performance.",
      author: "AcademicAce",
      rating: 5,
    },
    {
      quote:
        "The smart study system adapts to my learning style perfectly. I can manage multiple courses effortlessly and never miss important deadlines anymore.",
      author: "LearnSmart",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleSwitch((currentIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSwitch = (newIndex) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index) => handleSwitch(index);
  const goToPrevious = () =>
    handleSwitch(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  const goToNext = () =>
    handleSwitch(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) =>
      index < rating ? (
        <IoStar key={index} className="w-6 h-6 text-yellow-400" />
      ) : (
        <IoStarOutline key={index} className="w-6 h-6 text-gray-300" />
      )
    );
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image Section */}
          <div className="relative group">
            <div className="relative">
              <div className="relative rounded-[3rem] transform rotate-2 group-hover:rotate-0 transition-transform duration-700 overflow-hidden shadow-2xl shadow-brand-blue/10">
                <img
                  src="h6_testimonial_img.jpg"
                  alt="Happy student studying"
                  className="w-full h-80 md:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="absolute top-4 left-4 text-brand-yellow drop-shadow-lg">
                  <FaMapPin className="w-12 h-12" />
                </div>
              </div>

              <div className="absolute -bottom-8 md:-left-8 left-1/2 -translate-x-1/2 md:translate-x-0 bg-white rounded-3xl px-8 py-5 shadow-2xl border border-gray-100 backdrop-blur-sm">
                <div className="flex items-center space-x-4 ">
                  <div className="bg-brand-blue rounded-xl p-3 shadow-lg shadow-brand-blue/20">
                    <IoStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-gray-900 tracking-tighter">4.9/5</div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Trustpilot</div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex absolute -top-6 -right-6 bg-brand-yellow rounded-full w-16 h-16 items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                <FaQuoteLeft className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Right Side - Testimonials Section */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-6 bg-brand-blue/10 w-fit px-5 py-2 rounded-full border border-brand-blue/5">
                <span className="text-brand-blue font-bold text-xs uppercase tracking-widest">
                  Testimonials
                </span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                What Our Clients Say
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-600 mt-2">True Experiences</span>
              </h2>
            </div>

            {/* Testimonial Content with Transition */}
            <div className="relative min-h-[180px]">
              <div
                className={`transition-all duration-500 ease-in-out ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >
                {/* Stars */}
                <div className="flex space-x-1.5 mb-8">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl lg:text-3xl text-gray-600 font-medium leading-tight mb-8 tracking-tight">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author */}
                <div className="text-xl font-black text-brand-blue flex items-center gap-3">
                  <div className="w-8 h-px bg-brand-blue/30"></div>
                  {testimonials[currentIndex].author}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={goToPrevious}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-600 hover:text-blue-600 border"
                  aria-label="Previous testimonial"
                >
                  <IoChevronBack className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-600 hover:text-blue-600 border"
                  aria-label="Next testimonial"
                >
                  <IoChevronForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
