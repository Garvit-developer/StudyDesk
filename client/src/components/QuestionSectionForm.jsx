import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaBook,
  FaGraduationCap,
  FaImage,
  FaRegCommentDots,
  FaPencilAlt,
  FaComments,
  FaFileAlt,
  FaChalkboardTeacher,
  FaPlus,
  FaSlidersH,
  FaRocket,
} from "react-icons/fa";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js";

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

const TooltipButton = ({ icon, label }) => (
  <div className="relative group">
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
      {icon} {label}
    </div>
    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
      <div className="relative bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
        Coming soon!
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
      </div>
    </div>
  </div>
);

const QuestionSectionForm = ({ setAiResult, setLoading, loading }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [level, setLevel] = useState(levelOptions[0]);
  const [question, setQuestion] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractingText, setExtractingText] = useState(false);
  const [includeExplanation, setIncludeExplanation] = useState(false);
  const [includeSteps, setIncludeSteps] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single function to handle API submission
  const submitQuestion = async (questionData) => {
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const res = await axios.post("/api/ask-ai", questionData, {
        withCredentials: true,
      });

      const result = res.data;

      setAiResult({
        answer: result.answer,
        explanation: result.explanation,
        subject: result.subject,
        steps: result.steps,
        success: result.success,
      });

      // Reset form after successful submission
      setQuestion("");
      setSelectedFile(null);
      setPreview(null);
      setOpenAccordion(null);
      
    } catch (err) {
      console.error("API Error:", err.message);
      toast.error(
        err.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Check if data is coming from homework form and auto-submit hasn't been triggered yet
    if (
      state?.subject &&
      state?.level &&
      state?.question &&
      !autoSubmitTriggered &&
      !isSubmitting
    ) {
      const matchedSubject = subjectOptions.find(
        (opt) => opt.value === state.subject
      );
      if (matchedSubject) setSubject(matchedSubject);

      const matchedLevel = levelOptions.find(
        (opt) => opt.value === state.level
      );
      if (matchedLevel) setLevel(matchedLevel);

      setQuestion(state.question);

      // Mark that auto-submit has been triggered
      setAutoSubmitTriggered(true);

      // Clear the state by replacing it
      navigate(window.location.pathname, { replace: true, state: null });

      // Trigger auto-submit after a short delay to ensure state is set
      setTimeout(() => {
        const data = {
          question: state.question,
          grade: state.level,
          subjectUser: state.subject,
          explanation: includeExplanation,
          steps: includeSteps,
        };
        submitQuestion(data);
      }, 100);
    }
  }, [state, autoSubmitTriggered, navigate, includeExplanation, includeSteps, isSubmitting]);

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  const extractTextFromImage = async (imageFile) => {
    setExtractingText(true);
    const worker = await createWorker("eng", 1);
    try {
      const {
        data: { text },
      } = await worker.recognize(imageFile);
      setQuestion((prev) => (prev ? prev + "\n" + text : text));
      if (!text) {
        toast.error("No text found in the image.");
        setPreview(null);
      } else {
        toast.success("Text extracted from image!");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      toast.error("Failed to extract text.");
    } finally {
      await worker.terminate();
      setExtractingText(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if already submitting
    if (isSubmitting) {
      return;
    }

    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const data = {
      question,
      grade: level.value,
      subjectUser: subject.value,
      explanation: includeExplanation,
      steps: includeSteps,
    };

    await submitQuestion(data);
  };
const [searchQuery, setSearchQuery] = useState("");
  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="text-2xl font-bold mb-4">Question</h2>

      {/* Button Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md font-medium"
        >
          <FaPencilAlt /> Homework
        </button>
        <TooltipButton icon={<FaComments />} label="Chat" />
        <TooltipButton icon={<FaFileAlt />} label="Essay" />
        <TooltipButton icon={<FaChalkboardTeacher />} label="Teach" />
      </div>

      {/* Select Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="bg-gray-100 p-3 rounded-md">
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
    <FaBook /> Subject
  </label>
  <Select
    options={subjectOptions}   
    value={subject}
    onChange={setSubject}
    className="text-sm"
    isSearchable={true}       
    isDisabled={isSubmitting}
    placeholder="Select or search a subject..."
  />
</div>

        <div className="bg-gray-100 p-3 rounded-md">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
            <FaGraduationCap /> Level
          </label>
          <Select
            options={levelOptions}
            value={level}
            onChange={setLevel}
            className="text-sm"
            isSearchable={false}
            isDisabled={isSubmitting}
          />
        </div>
      </div>

      {/* Question Box */}
      <div className="bg-gray-100 p-3 rounded-md mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
          <FaRegCommentDots /> Your homework question
        </label>
        <textarea
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300"
          rows="3"
          placeholder="Enter your question here..."
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Accordion Section */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Upload Accordion */}
        <div>
          {/* <button
            type="button"
            onClick={() => toggleAccordion("upload")}
            className={`w-full flex justify-between items-center px-4 py-2 bg-gray-100 text-gray-700 border ${
              openAccordion === "upload"
                ? "rounded-t-md border-b-0"
                : "rounded-md"
            } transition-all duration-300`}
            disabled={isSubmitting}
          >
            <span className="flex items-center gap-2">
              <FaImage /> Upload File or Image
            </span>
            <FaPlus
              className={`transition-transform duration-300 ${
                openAccordion === "upload" ? "rotate-45" : ""
              }`}
            />
          </button> */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out bg-white px-4 border border-t-0 border-gray-300 text-sm text-gray-700 ${
              openAccordion === "upload"
                ? "max-h-60 py-3 rounded-b-md"
                : "max-h-0 py-0"
            }`}
          >
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    setPreview(URL.createObjectURL(file));
                    extractTextFromImage(file);
                  }
                }}
                className="border border-gray-300 p-2 rounded-md"
                disabled={isSubmitting}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              )}
              {extractingText && (
                <p className="text-sm text-blue-600 font-medium">
                  Extracting text from image...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion("advanced")}
            className={`w-full flex justify-between items-center px-4 py-2 bg-gray-100 text-gray-700 border ${
              openAccordion === "advanced"
                ? "rounded-t-md border-b-0"
                : "rounded-md"
            } transition-all duration-300`}
            disabled={isSubmitting}
          >
            <span className="flex items-center gap-2">
              <FaSlidersH /> Advanced Options
            </span>
            <FaPlus
              className={`transition-transform duration-300 ${
                openAccordion === "advanced" ? "rotate-45" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out bg-white px-4 border border-t-0 border-gray-300 text-sm text-gray-700 ${
              openAccordion === "advanced"
                ? "max-h-40 py-3 rounded-b-md"
                : "max-h-0 py-0"
            }`}
          >
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeExplanation}
                  onChange={(e) => setIncludeExplanation(e.target.checked)}
                  disabled={isSubmitting}
                />
                Include Explanation
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeSteps}
                  onChange={(e) => setIncludeSteps(e.target.checked)}
                  disabled={isSubmitting}
                />
                Include Steps
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        title="Answer"
        icon={<FaRocket />}
        loading={loading || extractingText || isSubmitting}
        disabled={isSubmitting}
      />
    </form>
  );
};

export default QuestionSectionForm;