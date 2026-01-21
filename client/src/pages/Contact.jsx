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
                    className="space-y-10"
                >
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent tracking-tighter leading-tight">
                            Get in Touch
                        </h1>
                        <p className="text-gray-500 text-xl font-medium tracking-tight">
                            Have questions, feedback, or want to collaborate? <br /> We'd love to hear from you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-300">
                                <FaEnvelope size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-blue uppercase tracking-widest mb-1">Email</p>
                                <a href="mailto:garvitdani@gmail.com" className="text-lg font-bold text-gray-900 hover:text-brand-blue transition-colors">garvitdani@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-300">
                                <FaPhone size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-blue uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-lg font-bold text-gray-900">+91 123 456 7890</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-300">
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-brand-blue uppercase tracking-widest mb-1">Location</p>
                                <p className="text-lg font-bold text-gray-900">India</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-brand-blue/5"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all resize-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 active:scale-95"
                        >
                            <span>Send Message</span>
                            <FaPaperPlane size={18} className="rotate-12" />
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;
