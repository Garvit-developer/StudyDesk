import React from "react";
import { motion } from "framer-motion";

const About = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        About Study Desk
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Empowering students with AI-driven tools to master their learning journey.
                    </p>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-blue-500/5 space-y-6"
                >
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-blue-600">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At Study Desk, we believe that quality education should be accessible, personalized, and engaging.
                            Our mission is to bridge the gap between traditional learning and modern technology by providing
                            students with an intelligent assistant that helps them explore difficult concepts, generate resources,
                            and track their progress efficiently.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-blue-600">What We Offer</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 marker:text-blue-600">
                            <li>AI-Powered Question Answering</li>
                            <li>Personalized Learning Roadmaps</li>
                            <li>Resource Generation & Study Materials</li>
                            <li>Progress Tracking & Analytics</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-blue-600">Our Story</h2>
                        <p className="text-gray-700 leading-relaxed">
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
