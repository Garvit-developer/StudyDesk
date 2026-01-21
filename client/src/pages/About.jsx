import React from "react";
import { motion } from "framer-motion";

const About = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                        About Study Desk
                    </h1>
                    <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto tracking-tight leading-relaxed">
                        Empowering students with AI-driven tools to master their learning journey with precision and ease.
                    </p>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-brand-blue/5 space-y-10"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            At Study Desk, we believe that quality education should be accessible, personalized, and engaging.
                            Our mission is to bridge the gap between traditional learning and modern technology by providing
                            students with an intelligent assistant that helps them explore difficult concepts, generate resources,
                            and track their progress efficiently.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">What We Offer</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 font-bold">
                            {['AI-Powered Question Answering', 'Personalized Learning Roadmaps', 'Resource Generation', 'Progress Tracking'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 bg-brand-blue/5 p-4 rounded-2xl border border-brand-blue/5 text-brand-blue">
                                    <span className="w-2 h-2 bg-brand-blue rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Our Story</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Study Desk started as a small project to help peers solve coding problems and has since evolved into
                            a comprehensive platform for students of all disciplines. We are constantly innovating to bring
                            the best tools to your fingertips.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
