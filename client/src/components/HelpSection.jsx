import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HelpSection = () => {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/question", {
      state: {
        question,
      },
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 300);
  };
  return (
    <div className="flex justify-center my-10 animate-fadeIn">
      <div className="w-full bg-gradient-to-r from-brand-blue to-indigo-700 text-white py-12 px-6 rounded-[40px] shadow-2xl shadow-brand-blue/20 max-w-6xl mx-5 md:mx-3 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">
          How Can Study Desk Help You?
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 p-2"
        >
          <input
            type="text"
            placeholder="Ask any question..."
            className="flex-1 md:px-6 px-4 py-4 text-white text-lg placeholder:text-white/60 focus:outline-none bg-transparent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full md:w-auto bg-brand-yellow hover:bg-yellow-400 text-gray-900 font-black px-10 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            Ask AI
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpSection;
