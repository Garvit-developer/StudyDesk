import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapSign, FaTrash, FaChevronRight, FaChevronDown, FaRoute, FaLightbulb, FaBookOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";
import gsap from "gsap";

const RoadmapCard = ({ roadmap, onDelete, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: "power3.out" }
        );
    }, [index]);

    return (
        <div ref={cardRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4 premium-card">
            <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/80 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <FaRoute size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{roadmap.topic}</h3>
                        <p className="text-xs text-indigo-600 uppercase tracking-widest font-black">{roadmap.grade} Level • {roadmap.content.phases.length} Phases</p>
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
                    <div className={`transition-transform duration-300 text-indigo-600 ${isOpen ? "rotate-90" : ""}`}>
                        <FaChevronRight />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50 bg-indigo-50/20 overflow-hidden"
                    >
                        <div className="p-6 space-y-8">
                            {roadmap.content.phases.map((phase, pIdx) => (
                                <div key={phase.phase} className="relative pl-10">
                                    {/* Vertical Line */}
                                    {pIdx !== roadmap.content.phases.length - 1 && (
                                        <div className="absolute left-[15px] top-8 bottom-[-32px] w-[2px] bg-indigo-200"></div>
                                    )}

                                    {/* Bullet */}
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white text-indigo-600 text-xs font-black flex items-center justify-center border-2 border-indigo-600 shadow-sm z-10">
                                        {phase.phase}
                                    </div>

                                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-gray-900 text-lg mb-2">{phase.title}</h4>
                                        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{phase.description}</p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                                                <div className="flex items-center gap-2 text-indigo-600 mb-3">
                                                    <FaLightbulb size={14} />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">Objectives</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {phase.objectives.map((obj, i) => (
                                                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                                                            {obj}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                                <div className="flex items-center gap-2 text-emerald-600 mb-3">
                                                    <FaBookOpen size={14} />
                                                    <span className="text-[11px] font-black uppercase tracking-wider">Resources</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {phase.resources.map((res, i) => (
                                                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
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
    const headerRef = useRef(null);

    useEffect(() => {
        fetchRoadmaps();
        gsap.from(headerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.out"
        });
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
        <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3 flex items-center gap-4">
                            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-2xl shadow-indigo-200">
                                <FaMapSign size={32} />
                            </div>
                            Study Roadmaps
                        </h1>
                        <p className="text-gray-500 text-lg">Structured paths to master any subject, powered by AI.</p>
                    </div>
                    <button
                        onClick={() => setIsGenerating(!isGenerating)}
                        className={`px-8 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3 ${isGenerating
                            ? "bg-white text-gray-600 shadow-gray-200 border border-gray-100"
                            : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95"
                            }`}
                    >
                        {isGenerating ? "Cancel" : <><FaRoute /> Create Roadmap</>}
                    </button>
                </div>

                {/* Generator Form */}
                <AnimatePresence>
                    {isGenerating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.95, marginBottom: 0 }}
                            animate={{ height: "auto", opacity: 1, scale: 1, marginBottom: 40 }}
                            exit={{ height: 0, opacity: 0, scale: 0.95, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest px-1">Goal Topic</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Quantum Physics, UX Design"
                                                className="w-full px-6 py-4 rounded-2xl bg-white/80 border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest px-1">Difficulty Level</label>
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-white/80 border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium cursor-pointer"
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
                                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 hover:-translate-y-1 active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Designing Your Future...
                                            </>
                                        ) : (
                                            <>Generate Professional Roadmap</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List */}
                <div className="space-y-6">
                    {roadmaps.length > 0 ? (
                        roadmaps.map((roadmap, index) => (
                            <RoadmapCard key={roadmap.id} roadmap={roadmap} onDelete={handleDelete} index={index} />
                        ))
                    ) : (
                        <div className="bg-white rounded-[2.5rem] p-24 text-center border-2 border-dashed border-gray-200">
                            <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600 animate-bounce">
                                <FaMapSign size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">No Roadmaps Created</h2>
                            <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">
                                Don't learn aimlessly. Tell our AI what you want to master and get a personalized learning path.
                            </p>
                            <button
                                onClick={() => setIsGenerating(true)}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100"
                            >
                                Get Started Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Roadmaps;

