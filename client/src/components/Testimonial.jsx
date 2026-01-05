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
          <div className="relative">
            <div className="relative">
              <div className="relative rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="h6_testimonial_img.jpg"
                  alt="Happy student studying"
                  className="w-full h-80  md:h-96 object-cover rounded-bl-[10rem] rounded-br-[9rem] rounded-tr-[6rem] shadow-lg"
                />

                <div className="absolute -top-5 left-0 text-red-500">
                  <FaMapPin className="w-16 h-16" />
                </div>
              </div>

              <div className="absolute -bottom-6 md:-left-4 left-[40%] bg-white rounded-2xl px-6 py-4 shadow-xl border  border-gray-300">
                <div className="flex items-center space-x-2 ">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <IoStar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-500 w-24">Real Reviews</div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute top-50 -right-5 bg-yellow-400 rounded-full p-4 shadow-lg">
                <FaQuoteLeft className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Testimonials Section */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 bg-blue-100 w-fit text-sm px-4 py-1 rounded-full">
                <span className="text-purple-600 font-semibold text-sm">
                  Testimonials
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                What's Our Client Say
                <span className="block text-gray-700">About Us</span>
              </h2>
            </div>

            {/* Testimonial Content with Transition */}
            <div className="relative min-h-[200px]">
              <div
                className={`transition-all duration-500 ease-in-out ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >
                {/* Stars */}
                <div className="flex space-x-1 mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-gray-600 italic leading-relaxed mb-6">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author */}
                <div className="text-lg font-semibold text-blue-600">
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
