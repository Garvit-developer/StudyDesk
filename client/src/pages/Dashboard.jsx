import React, { useEffect, useState } from "react";
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
import { FaQuestionCircle, FaLayerGroup, FaCheckCircle, FaFire, FaClock } from "react-icons/fa";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} text-white`}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return <div className="text-center py-10">No data available</div>;

    const { global, subjects, activity } = data;
    const masteryRate = global.totalFlashcards > 0
        ? Math.round((global.masteredFlashcards / global.totalFlashcards) * 100)
        : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Focus Time"
                    value={`${data.global.focusMinutes}m`}
                    icon={<FaClock size={20} />}
                    color="bg-indigo-600"
                />
                <StatCard
                    title="Questions Asked"
                    value={global.questionsAsked}
                    icon={<FaQuestionCircle size={20} />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Flashcards Created"
                    value={global.totalFlashcards}
                    icon={<FaLayerGroup size={20} />}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Daily Streak"
                    value={`${global.streak} Days`}
                    icon={<FaFire size={20} />}
                    color="bg-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activity}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Subject Breakdown</h3>
                    <div className="h-64 capitalize">
                        {subjects.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjects}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="subject"
                                    >
                                        {subjects.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No subject data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
