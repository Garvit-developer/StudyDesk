import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from "recharts";
import { FaQuestionCircle, FaLayerGroup, FaCheckCircle, FaFire, FaClock, FaChartLine, FaChartPie } from "react-icons/fa";
import gsap from "gsap";

const COLORS = ["#5751e1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const StatCard = ({ title, value, icon, color, index }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
        );
    }, [index]);

    return (
        <div ref={cardRef} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all premium-card group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (data) {
            gsap.from(".dashboard-section", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        }
    }, [data]);

    const fetchStats = async () => {
        try {
            const res = await axios.get("/api/stats", { withCredentials: true });
            if (res.data.success) {
                setData(res.data.stats);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="font-black text-gray-400 uppercase tracking-widest text-xs">Syncing Performance Data...</span>
            </div>
        );
    }

    if (!data) return <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest">No data available</div>;

    const { global, subjects, activity } = data;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10" ref={containerRef}>
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    index={0}
                    title="Focus Time"
                    value={`${data.global.focusMinutes}m`}
                    icon={<FaClock size={20} />}
                    color="bg-indigo-600 shadow-indigo-100"
                />
                <StatCard
                    index={1}
                    title="Questions"
                    value={global.questionsAsked}
                    icon={<FaQuestionCircle size={20} />}
                    color="bg-blue-600 shadow-blue-100"
                />
                <StatCard
                    index={2}
                    title="Flashcards"
                    value={global.totalFlashcards}
                    icon={<FaLayerGroup size={20} />}
                    color="bg-emerald-600 shadow-emerald-100"
                />
                <StatCard
                    index={3}
                    title="Current Streak"
                    value={`${global.streak} Days`}
                    icon={<FaFire size={20} />}
                    color="bg-orange-600 shadow-orange-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Activity Chart */}
                <div className="dashboard-section bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm premium-card">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                <FaChartLine size={18} />
                            </div>
                            Recent Activity
                        </h3>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Weekly Trend</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activity}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5751e1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#5751e1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ stroke: '#5751e1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                                    labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px', color: '#111827' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#5751e1' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                />
                                <Area type="monotone" dataKey="count" stroke="#5751e1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Breakdown */}
                <div className="dashboard-section bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm premium-card">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                                <FaChartPie size={18} />
                            </div>
                            Subject Analysis
                        </h3>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Top Subjects</span>
                    </div>
                    <div className="h-72 capitalize">
                        {subjects.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjects}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={8}
                                        dataKey="count"
                                        nameKey="subject"
                                        animationDuration={1500}
                                    >
                                        {subjects.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                                <div className="bg-gray-50 p-6 rounded-full">
                                    <FaLayerGroup size={32} className="text-gray-200" />
                                </div>
                                <span className="font-black text-xs uppercase tracking-widest">No subject data captured</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

