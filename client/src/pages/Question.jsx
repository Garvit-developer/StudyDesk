import React,{useState} from "react";
import QuestionSectionForm from "../components/QuestionSectionForm";
import ResultSection from "../components/ResultSection";

const Question = () => {
  const[loading,setLoading]=useState(false);
  const [aiResult, setAiResult] = useState({
    answer: "",
    explanation: "",
    subject: "",
    steps: "",
    success: true,
  });
  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
       <div className="h-fit bg-white border p-6 rounded-lg shadow-md w-full md:w-1/2">
         <QuestionSectionForm setAiResult={setAiResult} loading={loading} setLoading={setLoading} />
       </div>
        <ResultSection aiResult={aiResult} loading={loading}  />
      </div>
    </div>
  );
};

export default Question;
