import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapSign, FaTrash, FaChevronRight, FaChevronDown, FaRoute, FaLightbulb, FaBookOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";

const RoadmapCard = ({ roadmap, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
            <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                        <FaRoute size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{roadmap.topic}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{roadmap.grade} Level • {roadmap.content.phases.length} Phases</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(roadmap.id);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <FaTrash size={14} />
                    </button>
                    <div className="text-gray-400">
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50 bg-gray-50/30 overflow-hidden"
                    >
                        <div className="p-6 space-y-8">
                            {roadmap.content.phases.map((phase) => (
                                <div key={phase.phase} className="relative pl-8">
                                    {/* Vertical Line */}
                                    {phase.phase !== roadmap.content.phases.length && (
                                        <div className="absolute left-[11px] top-6 bottom-[-32px] w-[2px] bg-indigo-100"></div>
                                    )}

                                    {/* Bullet */}
                                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-4 border-white shadow-sm z-10">
                                        {phase.phase}
                                    </div>

                                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2">{phase.title}</h4>
                                        <p className="text-sm text-gray-600 mb-4">{phase.description}</p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                                    <FaLightbulb size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Objectives</span>
                                                </div>
                                                <ul className="space-y-1">
                                                    {phase.objectives.map((obj, i) => (
                                                        <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                                                            <span className="mt-1 w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                                                            {obj}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                                    <FaBookOpen size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Resources</span>
                                                </div>
                                                <ul className="space-y-1">
                                                    {phase.resources.map((res, i) => (
                                                        <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                                                            <span className="mt-1 w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                                                            {res}
                                                        </li>
                                                    ))}
                                                </ul>
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

const Roadmaps = () => {
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("9th-10th");
    const [loading, setLoading] = useState(false);
    const [roadmaps, setRoadmaps] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const res = await axios.get("/api/my-roadmaps", { withCredentials: true });
            if (res.data.success) {
                setRoadmaps(res.data.roadmaps);
            }
        } catch (err) {
            console.error("Failed to fetch roadmaps", err);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("/api/generate-roadmap", { topic, grade }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Roadmap generated!");
                setTopic("");
                fetchRoadmaps();
                setIsGenerating(false);
            }
        } catch (err) {
            toast.error("Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this roadmap?")) return;
        try {
            await axios.delete(`/api/roadmaps/${id}`, { withCredentials: true });
            setRoadmaps(roadmaps.filter(r => r.id !== id));
            toast.success("Roadmap deleted");
        } catch (err) {
            toast.error("Failed to delete roadmap");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
                            <FaMapSign className="text-indigo-600" /> Study Roadmaps
                        </h1>
                        <p className="text-gray-500">Structured paths to master any subject, powered by AI.</p>
                    </div>
                    <button
                        onClick={() => setIsGenerating(!isGenerating)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 ${isGenerating ? "bg-white text-gray-600 shadow-gray-100" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
                            }`}
                    >
                        {isGenerating ? "Cancel" : <><FaRoute /> Create New</>}
                    </button>
                </div>

                {/* Generator Form */}
                <AnimatePresence>
                    {isGenerating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: "auto", opacity: 1, marginBottom: 40 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                                <form onSubmit={handleGenerate} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">I want to learn about...</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Modern Web Development, 18th Century History"
                                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty / Grade Level</label>
                                            <select
                                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                            >
                                                <option value="6th-8th">Middle School (6th-8th)</option>
                                                <option value="9th-10th">High School (9th-10th)</option>
                                                <option value="11th-12th">Senior High (11th-12th)</option>
                                                <option value="college">College / University</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {loading ? "Designing Your Path..." : "Generate My Roadmap"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List */}
                <div className="space-y-4">
                    {roadmaps.length > 0 ? (
                        roadmaps.map((roadmap) => (
                            <RoadmapCard key={roadmap.id} roadmap={roadmap} onDelete={handleDelete} />
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                                <FaMapSign size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No roadmaps yet</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Stop aimless learning. Click "Create New" to generate a professional study plan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Roadmaps;
