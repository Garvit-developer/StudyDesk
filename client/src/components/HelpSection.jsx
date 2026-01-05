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
    <div className="flex justify-center">
      <div className="w-full bg-[#0453af] text-white py-8 px-4 rounded-[25px] shadow-lg max-w-6xl mx-5 md:mx-3 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          How Can Study Desk Help You?
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex flex-col md:flex-row items-center bg-[#f8f8f8] rounded-lg overflow-hidden shadow-sm"
        >
          <input
            type="text"
            placeholder="Ask any question"
            className="flex-1 md:px-6 px-2 py-5 text-gray-700 text-lg focus:outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#0052cc] hover:bg-[#0041a8] text-white font-semibold px-6 py-2 rounded-full m-2 shadow-md relative custom-boxShadow mr-4"
          >
            Answer
            <span className="absolute -bottom-1 -right-1 bg-[#001b66] w-full h-full rounded-full -z-10 translate-x-1 translate-y-1"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpSection;
