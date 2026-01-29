import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaGraduationCap, FaBook, FaCheck, FaTimes, FaRedo } from "react-icons/fa";

const Quiz = () => {
    const [step, setStep] = useState(1); // 1: Setup, 2: Quiz, 3: Results
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);

    const [setup, setSetup] = useState({
        subject: "",
        grade: "9th-10th"
    });

    const handleStartQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("/api/generate-quiz", setup, { withCredentials: true });
            if (res.data.success) {
                setQuizData(res.data.quiz);
                setStep(2);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setScore(0);
            }
        } catch (err) {
            toast.error("Failed to generate quiz. Try a different subject.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option) => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const isCorrect = option === currentQuestion.correctAnswer;

        setUserAnswers([...userAnswers, {
            question: currentQuestion.question,
            selected: option,
            correct: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            isCorrect
        }]);

        if (isCorrect) setScore(score + 1);

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setStep(3);
        }
    };

    return (
        <div className="min-h-[60vh] p-6 max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl"
                    >
                        <div className="text-center mb-8">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <FaGraduationCap size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">AI Quiz Generator</h2>
                            <p className="text-gray-500 mt-2">Test your knowledge with custom AI-powered quizes.</p>
                        </div>

                        <form onSubmit={handleStartQuiz} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Topic</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Quantum Physics, World War II, Photosynthesis"
                                    className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={setup.subject}
                                    onChange={(e) => setSetup({ ...setup, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                                <select
                                    className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={setup.grade}
                                    onChange={(e) => setSetup({ ...setup, grade: e.target.value })}
                                >
                                    <option value="6th-8th">Middle School (6th-8th)</option>
                                    <option value="9th-10th">High School (9th-10th)</option>
                                    <option value="11th-12th">Senior High (11th-12th)</option>
                                    <option value="college">College</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                            >
                                {loading ? "Generating Quiz..." : "Start Quiz"}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && quizData && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
                                Question {currentQuestionIndex + 1} of {quizData.questions.length}
                            </span>
                            <div className="h-2 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 transition-all duration-300"
                                    style={{ width: `${((currentQuestionIndex) / quizData.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                            {quizData.questions[currentQuestionIndex].question}
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {quizData.questions[currentQuestionIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group active:scale-[0.98]"
                                >
                                    <span className="inline-block w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-center leading-8 font-bold mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-gray-700 font-medium">{option}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                            <div className="text-6xl font-black text-indigo-600 my-6">
                                {score} <span className="text-2xl text-gray-400">/ {quizData.questions.length}</span>
                            </div>
                            <p className="text-gray-500 text-lg mb-8">
                                {score === quizData.questions.length ? "Perfect score! You're a master." :
                                    score > quizData.questions.length / 2 ? "Great job! Keep it up." : "Good effort! Practice makes perfect."}
                            </p>
                            <button
                                onClick={() => setStep(1)}
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                            >
                                <FaRedo /> Try Another Quiz
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 px-2">Review Answers</h3>
                            {userAnswers.map((item, idx) => (
                                <div key={idx} className={`p-6 rounded-2xl border-2 ${item.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 mb-4">{item.question}</p>
                                            <div className="space-y-2 text-sm">
                                                <p className="flex items-center gap-2">
                                                    <span className="text-gray-500">Your answer:</span>
                                                    <span className={item.isCorrect ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                                                        {item.selected} {item.isCorrect ? <FaCheck className="inline ml-1" /> : <FaTimes className="inline ml-1" />}
                                                    </span>
                                                </p>
                                                {!item.isCorrect && (
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-gray-500">Correct:</span>
                                                        <span className="text-emerald-600 font-bold">{item.correct}</span>
                                                    </p>
                                                )}
                                                <div className="mt-4 p-4 bg-white/50 rounded-xl text-gray-600 italic">
                                                    {item.explanation}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
