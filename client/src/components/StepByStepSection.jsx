import React from 'react';
import { GiTalk, GiArchiveResearch, GiNotebook } from 'react-icons/gi';

const StepByStepSection = () => {
  return (
    <section className="text-center py-24 px-4 md:px-20 bg-white animate-fadeIn">
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
        Step-By-Step Guidance 24/7
      </h2>
      <p className="text-xl text-gray-500 font-medium mb-16 max-w-3xl mx-auto tracking-tight">
        Receive step-by-step guidance & homework help for any homework problem & any subject 24/7.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
        {/* Ask any question */}
        <div className="flex flex-col items-center group cursor-pointer p-8 rounded-3xl hover:bg-surface-soft transition-all duration-300">
          <div className="bg-brand-yellow p-5 rounded-2xl shadow-lg shadow-brand-yellow/20 transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3">
            <GiTalk className="text-5xl text-gray-900" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tight">Ask any question</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Study Desk offers comprehensive learning resources for students of all ages, from elementary school through graduate-level education.
          </p>
        </div>

        {/* Get an answer */}
        <div className="flex flex-col items-center group cursor-pointer p-8 rounded-3xl hover:bg-surface-soft transition-all duration-300">
          <div className="bg-brand-yellow p-5 rounded-2xl shadow-lg shadow-brand-yellow/20 transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:-rotate-3">
            <GiNotebook className="text-5xl text-gray-900" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tight">Get an answer</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Study Desk delivers answers in seconds—whether it’s multiple choice, short answers, or even full-length essays!
          </p>
        </div>

        {/* Review your history */}
        <div className="flex flex-col items-center group cursor-pointer p-8 rounded-3xl hover:bg-surface-soft transition-all duration-300">
          <div className="bg-brand-yellow p-5 rounded-2xl shadow-lg shadow-brand-yellow/20 transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3">
            <GiArchiveResearch className="text-5xl text-gray-900" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tight">Review your history</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Review your previous questions and answers anytime to prepare for tests and boost your grades.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StepByStepSection;
