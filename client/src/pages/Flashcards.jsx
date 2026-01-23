import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCheckCircle, FaRegCircle, FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Flashcard = ({ card, onDelete, onToggleMastery }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="h-64 w-full perspective-1000 group">
            <motion.div
                className="relative h-full w-full transition-all duration-500 preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-white border-2 border-indigo-50 p-6 flex flex-col justify-between backface-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">
                            {card.subject}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleMastery(card.id, !card.is_mastered);
                                }}
                                className={`p-1.5 rounded-full transition-colors ${card.is_mastered ? "text-green-500 bg-green-50" : "text-gray-300 bg-gray-50 hover:text-green-500"
                                    }`}
                                title={card.is_mastered ? "Mastered" : "Mark as mastered"}
                            >
                                {card.is_mastered ? <FaCheckCircle /> : <FaRegCircle />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(card.id);
                                }}
                                className="p-1.5 rounded-full text-gray-300 bg-gray-50 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center text-center overflow-auto px-2">
                        <h3 className="text-gray-800 font-semibold leading-relaxed">
                            {card.question}
                        </h3>
                    </div>
                    <div className="text-[10px] text-gray-400 text-center font-medium uppercase tracking-widest mt-4">
                        Click to Flip
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 h-full w-full rounded-2xl bg-indigo-600 p-6 flex flex-col justify-between backface-hidden shadow-xl"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        Answer
                    </div>
                    <div className="flex-grow flex items-center justify-center text-center overflow-auto px-2">
                        <p className="text-white font-medium leading-relaxed">
                            {card.answer}
                        </p>
                    </div>
                    <div className="text-[10px] text-white/40 text-center font-medium uppercase tracking-widest mt-4">
                        Click to See Question
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Flashcards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, mastered, learning

    useEffect(() => {
        fetchFlashcards();
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
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">My Flashcards</h1>
                        <p className="text-gray-500">Practice active recall to master your subjects.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search cards..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("learning")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'learning' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                To Learn
                            </button>
                            <button
                                onClick={() => setFilter("mastered")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'mastered' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Mastered
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredCards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Flashcard
                                        card={card}
                                        onDelete={handleDelete}
                                        onToggleMastery={handleToggleMastery}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                            <FaPlus size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No flashcards found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Generate answers using the Study AI and click the heart icon to save them as flashcards.
                        </p>
                        <a href="/dashboard/question" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                            Get Started
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
      `}</style>
        </div>
    );
};

export default Flashcards;
