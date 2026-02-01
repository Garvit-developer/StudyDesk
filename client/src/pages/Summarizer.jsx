import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCompressAlt, FaCopy, FaMagic, FaEraser } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Summarizer = () => {
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState("medium");

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
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-100 rotate-12">
                        <FaCompressAlt size={28} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">AI Text Summarizer</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">Condense long articles, essays, or notes into concise, digestible summaries in seconds.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Input Text</span>
                            <div className="flex gap-4">
                                <select
                                    className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                >
                                    <option value="short">Short</option>
                                    <option value="medium">Medium</option>
                                    <option value="long">Detailed</option>
                                </select>
                                <button
                                    onClick={clearAll}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Clear all"
                                >
                                    <FaEraser size={14} />
                                </button>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-80 p-5 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-700 leading-relaxed"
                            placeholder="Paste your long study material or article here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />

                        <button
                            onClick={handleSummarize}
                            disabled={loading || text.length < 50}
                            className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Summarizing...
                                </>
                            ) : (
                                <>
                                    <FaMagic /> Summarize Now
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    <AnimatePresence mode="wait">
                        {summary ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-indigo-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <span className="text-sm font-bold text-white/70 uppercase tracking-widest">AI Generated Summary</span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all active:scale-90"
                                    >
                                        <FaCopy size={16} />
                                    </button>
                                </div>

                                <div className="text-white text-lg font-medium leading-relaxed mb-6 space-y-4 relative z-10 whitespace-pre-line">
                                    {summary}
                                </div>

                                <div className="pt-6 border-t border-white/10 relative z-10 flex justify-between items-center text-white/50 text-xs font-bold uppercase">
                                    <span>Summary Length: {length}</span>
                                    <span>{summary.split(' ').length} Words</span>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-gray-400">
                                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                                    <FaCompressAlt size={40} className="text-gray-200" />
                                </div>
                                <p className="font-bold text-gray-500 mb-2">Ready to summarize</p>
                                <p className="text-sm max-w-[200px]">Paste your text on the left and click the button to see the magic here.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Summarizer;
