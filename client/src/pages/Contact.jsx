import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form Submitted", formData);
        alert("Thank you for reaching out! We will get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20 pb-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Have questions, feedback, or want to collaborate? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase">Email</p>
                                <a href="mailto:garvitdani@gmail.com" className="hover:text-blue-600 transition-colors">garvitdani@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <FaPhone size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase">Phone</p>
                                <p>+91 123 456 7890</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase">Location</p>
                                <p>India</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-blue-500/5"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            <span>Send Message</span>
                            <FaPaperPlane size={16} />
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;
