import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaRedo, FaChevronUp, FaChevronDown, FaClock } from "react-icons/fa";
import { toast } from "react-hot-toast";

const PomodoroTimer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("work"); // work, shortBreak, longBreak
    const [sessionCount, setSessionCount] = useState(0);

    const timerRef = useRef(null);

    const settings = {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        clearInterval(timerRef.current);

        if (mode === "work") {
            const nextSessionCount = sessionCount + 1;
            setSessionCount(nextSessionCount);

            if (nextSessionCount % 4 === 0) {
                setMode("longBreak");
                setTimeLeft(settings.longBreak);
                toast.success("Time for a long break! Great job!");
            } else {
                setMode("shortBreak");
                setTimeLeft(settings.shortBreak);
                toast.success("Work session complete! Take a short break.");
            }
        } else {
            setMode("work");
            setTimeLeft(settings.work);
            toast.success("Break over! Let's get back to work.");
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(settings[mode]);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(settings[newMode]);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl w-64 text-center"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                {mode === "work" ? "Session" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                            </span>
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-4 rounded-full ${i < (sessionCount % 4) ? "bg-indigo-600" : "bg-gray-200"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-5xl font-mono font-bold text-gray-900 mb-6 tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>

                        <div className="flex justify-center gap-3 mb-6">
                            <button
                                onClick={toggleTimer}
                                className={`p-4 rounded-full text-white shadow-lg transition-all transform hover:scale-110 active:scale-95 ${isActive ? "bg-amber-500" : "bg-indigo-600 shadow-indigo-200"
                                    }`}
                            >
                                {isActive ? <FaPause /> : <FaPlay className="ml-1" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all transform hover:scale-110 active:scale-95"
                            >
                                <FaRedo />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => switchMode("work")}
                                className={`text-[10px] font-bold py-1 px-2 rounded-lg transition-all ${mode === "work" ? "bg-indigo-100 text-indigo-700 font-bold" : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                WORK
                            </button>
                            <button
                                onClick={() => switchMode("shortBreak")}
                                className={`text-[10px] font-bold py-1 px-2 rounded-lg transition-all ${mode === "shortBreak" ? "bg-green-100 text-green-700" : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                SHORT
                            </button>
                            <button
                                onClick={() => switchMode("longBreak")}
                                className={`text-[10px] font-bold py-1 px-2 rounded-lg transition-all ${mode === "longBreak" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                LONG
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl hover:shadow-indigo-200 transition-all border-4 border-white overflow-hidden relative"
            >
                {isActive ? (
                    <div className="absolute inset-0 bg-indigo-500">
                        <motion.div
                            className="absolute bottom-0 left-0 w-full bg-indigo-700/50"
                            initial={{ height: "0%" }}
                            animate={{ height: `${(1 - timeLeft / settings[mode]) * 100}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                    {isOpen ? <FaChevronDown /> : <FaClock size={24} />}
                    {isActive && !isOpen && (
                        <span className="text-[10px] font-bold mt-0.5">
                            {formatTime(timeLeft)}
                        </span>
                    )}
                </div>
            </motion.button>
        </div>
    );
};

export default PomodoroTimer;
