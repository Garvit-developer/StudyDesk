import React from 'react';
import { GiTalk, GiArchiveResearch, GiNotebook } from 'react-icons/gi';

const StepByStepSection = () => {
  return (
    <section className="text-center py-16 px-4 md:px-20 bg-white">
      <h2 className="text-4xl  font-bold text-gray-900 mb-4">
        Step-By-Step Guidance 24/7
      </h2>
      <p className="text-lg  text-gray-600 font-medium mb-12 relative inline-block">
        Receive step-by-step guidance & homework help for any homework problem & any subject 24/7
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* Ask any question */}
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="bg-[#ffc224] p-4 rounded-2xl transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1">
            <GiTalk className="text-5xl text-black" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Ask any question</h3>
          <p className="text-gray-500 max-w-sm">
            Study Desk offers comprehensive learning resources for students of all ages, from elementary school through graduate-level education.
          </p>
        </div>

        {/* Get an answer */}
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="bg-[#ffc224] p-4 rounded-2xl transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1">
            <GiNotebook className="text-5xl text-black" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Get an answer</h3>
          <p className="text-gray-500 max-w-sm">
            StudyMonkey delivers answers in seconds—whether it’s multiple choice, short answers, or even full-length essays!
          </p>
        </div>

        {/* Review your history */}
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="bg-[#ffc224] p-4 rounded-2xl transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1">
            <GiArchiveResearch className="text-5xl text-black" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Review your history</h3>
          <p className="text-gray-500 max-w-sm">
            Review your previous questions and answers anytime to prepare for tests and boost your grades.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StepByStepSection;
