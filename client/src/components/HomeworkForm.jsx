import React, { useState } from "react";
import Select from "react-select";
import {
  FaBook,
  FaGraduationCap,
  FaCommentDots,
  FaRocket,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "./Button";


const subjectOptions = [
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "computerscience", label: "Computer Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "english", label: "English" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "socialscience", label: "Social Science" },
  { value: "civics", label: "Civics" },
  { value: "economics", label: "Economics" },
  { value: "computerit", label: "Computer IT" },
  { value: "environmentalscience", label: "Environmental Science" },
  { value: "generalknowledge", label: "General Knowledge" },
  { value: "moraleducation", label: "Moral Education" },
  { value: "arts&crafts", label: "Arts & Crafts" },
  { value: "music", label: "Music" },
  { value: "physicaleducation", label: "Physical Education" },
  { value: "hindi", label: "Hindi" },
  { value: "accountancy", label: "Accountancy" },
  { value: "businessstudies", label: "Business Studies" },
  { value: "sociology", label: "Sociology" },
  { value: "psychology", label: "Psychology" },
  { value: "philosophy", label: "Philosophy" },
  { value: "homescience", label: "Home Science" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "biotechnology", label: "Biotechnology" },
  { value: "statistics", label: "Statistics" },
  { value: "coding", label: "Coding" },
  { value: "ArtificialIntelligence", label: "Artificial Intelligence" },
  { value: "lifeskills", label: "Life Skills" },
  { value: "digitalliteracy", label: "Digital Literacy" },
  { value: "vocationaleducation", label: "Vocational Education" },
  { value: "projectbasedlearning", label: "Project-based Learning" },
  { value: "iks", label: "Indian Knowledge Systems" },
  { value: "languagediversity", label: "Language Diversity" },
  { value: "environmentaleducation", label: "Environmental Education" },
  { value: "criticalthinking", label: "Critical Thinking" }
];

const levelOptions = [
  { value: "1st-3rd", label: "1st-3rd Grade" },
  { value: "4th-5th", label: "4th-5th Grade" },
  { value: "6th-8th", label: "6th-8th Grade" },
  { value: "9th-10th", label: "9th-10th Grade" },
  { value: "11th-12th", label: "11th-12th Grade" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
];

export default function HomeworkForm() {
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [level, setLevel] = useState(levelOptions[0]);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/question", {
      state: {
        subject: subject.value,
        level: level.value,
        question,
      },
    });
  };

  return (
    <div className="max-w-5xl md:mx-auto mb-16 p-8 bg-white mx-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div>
            <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaBook className="text-brand-blue" /> Subject
            </label>
            <Select
              options={subjectOptions}
              isSearchable={true}
              value={subject}
              onChange={setSubject}
              className="text-black"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  padding: '2px',
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#155dfc' }
                })
              }}
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaGraduationCap className="text-brand-blue" /> Level
            </label>
            <Select
              options={levelOptions}
              value={level}
              isSearchable={false}
              onChange={setLevel}
              className="text-black"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  padding: '2px',
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#155dfc' }
                })
              }}
            />
          </div>
        </div>

        <div className="relative">
          <div className="hidden absolute right-4 -top-8 md:flex items-center justify-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 99.3 57"
              width="40"
              className="mt-5 opacity-40"
            >
              <path
                fill="none"
                stroke="var(--color-brand-blue)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeMiterlimit="10"
                d="M2,39.5l7.7,14.8c0.4,0.7,1.3,0.9,2,0.4L27.9,42"
              ></path>
              <path
                fill="none"
                stroke="var(--color-brand-blue)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeMiterlimit="10"
                d="M11,54.3c0,0,10.3-65.2,86.3-50"
              ></path>
            </svg>
            <span className="text-[10px] bg-brand-blue/10 px-3 py-1.5 text-brand-blue font-black rounded-full animate-zoom-in-out ml-2">
              Type your question here!
            </span>
          </div>
          <label className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaCommentDots className="text-brand-blue" />
            Your homework question <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full border rounded-xl px-5 py-4 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all border-gray-100"
            placeholder="Enter your homework question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <Button
            type={"submit"}
            icon={<FaRocket />}
            title={" Answer"}
            customStyle="mx-auto md:w-1/2  w-full"
          />
        </div>
      </form>
    </div>
  );
}
