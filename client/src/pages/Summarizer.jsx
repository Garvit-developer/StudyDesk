import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCompressAlt, FaCopy, FaMagic, FaEraser, FaSparkles } from "react-icons/fa";
import { toast } from "react-hot-toast";
import gsap from "gsap";

const Summarizer = () => {
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState("medium");
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        });
    }, []);

    const handleSummarize = async (e) => {
        e.preventDefault();
        if (text.trim().length < 50) {
            toast.error("Please enter a longer text (at least 50 characters).");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("/api/summarize", { text, length }, { withCredentials: true });
            if (res.data.success) {
                setSummary(res.data.summary);
                toast.success("Summary generated!");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to generate summary.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        toast.success("Copied to clipboard!");
    };

    const clearAll = () => {
        setText("");
        setSummary("");
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-10" ref={containerRef}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-indigo-200 rotate-12 animate-up-down">
                        <FaCompressAlt size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">AI Text Summarizer</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Condense long articles, essays, or notes into concise, digestible summaries using advanced AI.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                    {/* Input Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col premium-card">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Source Material</span>
                            <div className="flex gap-4">
                                <select
                                    className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                >
                                    <option value="short">Short</option>
                                    <option value="medium">Medium</option>
                                    <option value="long">Detailed</option>
                                </select>
                                <button
                                    onClick={clearAll}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Clear all"
                                >
                                    <FaEraser size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-grow">
                            <textarea
                                className="w-full h-[400px] lg:h-full min-h-[400px] p-6 rounded-2xl bg-gray-50/50 border border-gray-100 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all resize-none text-gray-700 leading-relaxed font-medium"
                                placeholder="Paste your long study material or article here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                                    <motion.div
                                        className="h-1 bg-indigo-600 absolute top-0 left-0 right-0 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                                        <div className="w-6 h-6 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <span className="font-black text-gray-900 uppercase tracking-widest text-xs">AI Scanning...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSummarize}
                            disabled={loading || text.trim().length < 50}
                            className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 active:scale-95"
                        >
                            {loading ? (
                                "Processing..."
                            ) : (
                                <>
                                    <FaMagic /> Summarize Now
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="flex flex-col">
                        <AnimatePresence mode="wait">
                            {summary ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full flex flex-col"
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-lg text-white">
                                                <FaSparkles size={14} />
                                            </div>
                                            <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">Summary Result</span>
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl transition-all active:scale-90 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <FaCopy size={12} /> Copy
                                        </button>
                                    </div>

                                    <div className="text-white text-xl font-medium leading-relaxed mb-10 space-y-6 relative z-10 whitespace-pre-line flex-grow scrollbar-hide overflow-y-auto pr-2 custom-scrollbar-white">
                                        {summary}
                                    </div>

                                    <div className="pt-8 border-t border-white/10 relative z-10 flex justify-between items-center text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <div className="flex gap-6">
                                            <span>Format: {length}</span>
                                            <span>Words: {summary.split(/\s+/).filter(Boolean).length}</span>
                                        </div>
                                        <span className="bg-white/10 px-3 py-1 rounded-full text-white">AI Verified</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-16 text-center text-gray-400 premium-card">
                                    <div className="bg-indigo-50/50 p-8 rounded-full mb-8 animate-zoom-in-out">
                                        <FaCompressAlt size={48} className="text-indigo-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-widest">Ready to Summarize</h3>
                                    <p className="text-gray-500 text-lg max-w-[280px] leading-relaxed">
                                        Paste your material on the left and see the magic happen here.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar-white::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar-white::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar-white::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Summarizer;

