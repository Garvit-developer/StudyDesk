import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheckCircle, FaRegCircle, FaPlus, FaSearch, FaLightbulb } from "react-icons/fa";
import { toast } from "react-hot-toast";
import gsap from "gsap";

const Flashcard = ({ card, onDelete, onToggleMastery, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: index * 0.05, ease: "power2.out" }
        );
    }, [index]);

    const handleFlip = () => {
        const nextState = !isFlipped;
        setIsFlipped(nextState);
        gsap.to(innerRef.current, {
            rotateY: nextState ? 180 : 0,
            duration: 0.6,
            ease: "back.out(1.2)"
        });
    };

    return (
        <div ref={cardRef} className="h-72 w-full perspective-1000 group">
            <div
                ref={innerRef}
                className="relative h-full w-full preserve-3d cursor-pointer shadow-sm hover:shadow-xl transition-shadow rounded-3xl"
                onClick={handleFlip}
            >
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-3xl bg-white border border-gray-100 p-8 flex flex-col justify-between backface-hidden">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {card.subject}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleMastery(card.id, !card.is_mastered);
                                }}
                                className={`p-2 rounded-xl transition-all ${card.is_mastered ? "text-emerald-500 bg-emerald-50 shadow-inner" : "text-gray-300 bg-gray-50 hover:text-emerald-500 hover:bg-emerald-50"
                                    }`}
                                title={card.is_mastered ? "Mastered" : "Mark as mastered"}
                            >
                                {card.is_mastered ? <FaCheckCircle size={14} /> : <FaRegCircle size={14} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(card.id);
                                }}
                                className="p-2 rounded-xl text-gray-300 bg-gray-50 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center text-center px-2 py-4">
                        <h3 className="text-gray-800 font-bold text-lg leading-relaxed">
                            {card.question}
                        </h3>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaLightbulb /> Click to Reveal
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 h-full w-full rounded-3xl bg-indigo-600 p-8 flex flex-col justify-between backface-hidden shadow-2xl"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-white/30 rounded-full"></div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                            Answer Key
                        </span>
                    </div>
                    <div className="flex-grow flex items-center justify-center text-center px-2 py-4">
                        <p className="text-white font-semibold text-lg leading-relaxed overflow-y-auto max-h-40 custom-scrollbar-white">
                            {card.answer}
                        </p>
                    </div>
                    <div className="text-[10px] text-white/40 text-center font-black uppercase tracking-[0.2em]">
                        Click to Flip Back
                    </div>
                </div>
            </div>
        </div>
    );
};

const Flashcards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, mastered, learning
    const containerRef = useRef(null);

    useEffect(() => {
        fetchFlashcards();
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out"
        });
    }, []);

    const fetchFlashcards = async () => {
        try {
            const res = await axios.get("/api/flashcards", { withCredentials: true });
            if (res.data.success) {
                setCards(res.data.flashcards);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load flashcards");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
        try {
            await axios.delete(`/api/flashcards/${id}`, { withCredentials: true });
            setCards(cards.filter(c => c.id !== id));
            toast.success("Card deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleToggleMastery = async (id, status) => {
        try {
            await axios.patch(`/api/flashcards/${id}/mastery`, { isMastered: status }, { withCredentials: true });
            setCards(cards.map(c => c.id === id ? { ...c, is_mastered: status } : c));
            toast.success(status ? "Mastered! Well done." : "Keep practicing!");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const filteredCards = cards.filter(card => {
        const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.subject.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "mastered") return matchesSearch && card.is_mastered;
        if (filter === "learning") return matchesSearch && !card.is_mastered;
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#fcfcfd] p-6 md:p-10" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">Study Flashcards</h1>
                        <p className="text-gray-500 text-lg">Master your subjects through active recall and spaced repetition.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:flex-grow-0">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search cards..."
                                className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all w-full lg:w-72 font-medium shadow-sm hover:shadow-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="glass flex p-1.5 rounded-2xl border border-white/50 shadow-xl w-full sm:w-auto">
                            {['all', 'learning', 'mastered'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex-grow sm:flex-grow-0 ${filter === f
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'text-gray-500 hover:text-indigo-600'}`}
                                >
                                    {f === 'all' ? 'All' : f === 'learning' ? 'To Learn' : 'Mastered'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-80 gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading Deck...</span>
                    </div>
                ) : filteredCards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    layout
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                >
                                    <Flashcard
                                        card={card}
                                        onDelete={handleDelete}
                                        onToggleMastery={handleToggleMastery}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-24 text-center border-2 border-dashed border-gray-200 premium-card">
                        <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600 animate-zoom-in-out">
                            <FaPlus size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Empty Study Deck</h2>
                        <p className="text-gray-500 mb-10 text-lg max-w-sm mx-auto">
                            No cards match your search. Generate answers using our AI and save them as cards to start studying.
                        </p>
                        <a href="/dashboard/question" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:-translate-y-1 active:scale-95">
                            <FaMagic /> Generate Cards
                        </a>
                    </div>
                )}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
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

export default Flashcards;

