import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaHistory, FaMap, FaLayerGroup, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ roadmaps: [], flashcards: [], history: [] });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults({ roadmaps: [], flashcards: [], history: [] });
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 1) {
                handleSearch();
            } else {
                setResults({ roadmaps: [], flashcards: [], history: [] });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, isOpen]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/search?q=${query}`, { withCredentials: true });
            if (res.data.success) {
                setResults(res.data.results);
            }
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-start justify-center pt-24 px-4 sm:px-6">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-fadeIn">
                <div className="flex items-center p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <FaSearch className="text-blue-600 mr-4" size={22} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for anything..."
                        className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-gray-800 dark:text-white placeholder:text-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-2xl transition-colors shadow-sm"
                    >
                        <FaTimes className="text-gray-400" size={18} />
                    </button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Searching Knowledge Base...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {results.roadmaps.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <FaMap className="text-blue-500" /> Learning Roadmaps
                                    </h3>
                                    <div className="grid gap-3">
                                        {results.roadmaps.map(r => (
                                            <div key={r.id} onClick={() => { navigate('/dashboard/roadmaps'); onClose(); }} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 transition-all cursor-pointer">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-700 transition-colors uppercase text-sm tracking-tight">{r.title}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{r.subject}</p>
                                                </div>
                                                <FaArrowRight className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" size={12} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {results.flashcards.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <FaLayerGroup className="text-emerald-500" /> Study Flashcards
                                    </h3>
                                    <div className="grid gap-3">
                                        {results.flashcards.map(f => (
                                            <div key={f.id} onClick={() => { navigate('/dashboard/flashcards'); onClose(); }} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 transition-all cursor-pointer">
                                                <div className="flex-1 pr-4">
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{f.question}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{f.subject}</p>
                                                </div>
                                                <FaArrowRight className="text-gray-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" size={12} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {results.history.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <FaHistory className="text-orange-500" /> AI Help History
                                    </h3>
                                    <div className="grid gap-3">
                                        {results.history.map(h => (
                                            <div key={h.id} onClick={() => { navigate('/dashboard/history'); onClose(); }} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-100 transition-all cursor-pointer">
                                                <div className="flex-1 pr-4">
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{h.question}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{h.subject}</p>
                                                </div>
                                                <FaArrowRight className="text-gray-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all" size={12} />
                                            </div>
                                        ))}
                                    </div>
                                </section> section>
                            )}

                            {query.trim().length > 1 && !loading && !results.roadmaps.length && !results.flashcards.length && !results.history.length && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-6">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-full">
                                        <FaSearch size={40} className="text-gray-200 dark:text-gray-700" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900 dark:text-white mb-2">No matching knowledge found</p>
                                        <p className="text-sm font-medium tracking-wide">We couldn't find any roadmaps, flashcards, or history for "<span className="text-blue-600 font-bold">{query}</span>"</p>
                                    </div>
                                </div>
                            )}

                            {!query.trim() && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-4">
                                    <FaSearch size={48} className="opacity-20" />
                                    <p className="font-black text-xs uppercase tracking-[0.3em]">Start typing to explore</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
