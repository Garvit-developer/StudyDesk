import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaThLarge, FaLayerGroup, FaTasks, FaMap, FaHistory, FaCog, FaMicrochip } from 'react-icons/fa';

const SidebarLink = ({ to, icon, label }) => (
    <NavLink
        to={to}
        end={to === "/dashboard"}
        className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-800'
            }`
        }
    >
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="font-bold tracking-wide">{label}</span>
    </NavLink>
);

const Sidebar = () => {
    return (
        <div className="hidden lg:flex flex-col w-80 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-8 gap-3 sticky top-24 h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar">
            <div className="mb-6 px-4">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Learning Center</p>
            </div>

            <nav className="space-y-2">
                <SidebarLink to="/dashboard" icon={<FaThLarge size={20} />} label="Overview" />
                <SidebarLink to="/dashboard/flashcards" icon={<FaLayerGroup size={20} />} label="Flashcards" />
                <SidebarLink to="/dashboard/quiz" icon={<FaTasks size={20} />} label="Quiz" />
                <SidebarLink to="/dashboard/roadmaps" icon={<FaMap size={20} />} label="Roadmaps" />
                <SidebarLink to="/dashboard/summarizer" icon={<FaMicrochip size={20} />} label="Summarizer" />
            </nav>

            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Preferences</p>
                <nav className="space-y-2">
                    <SidebarLink to="/dashboard/history" icon={<FaHistory size={20} />} label="Activity History" />
                    <SidebarLink to="/dashboard/settings" icon={<FaCog size={20} />} label="Account Settings" />
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
