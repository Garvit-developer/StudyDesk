import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm mb-8">Last Updated: January 2026</p>

                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-blue-500/5 space-y-6 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
                            <p>
                                Welcome to Study Desk. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-gray-600">
                                <li>Identity Data: Name, username.</li>
                                <li>Contact Data: Email address.</li>
                                <li>Usage Data: Information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-gray-600">
                                <li>To register you as a new customer.</li>
                                <li>To provide the services you requested.</li>
                                <li>To improve our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:garvitdani@gmail.com" className="text-blue-600 hover:underline">garvitdani@gmail.com</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
