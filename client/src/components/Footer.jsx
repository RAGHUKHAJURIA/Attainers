import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-gray-50 pt-24 pb-12 overflow-hidden border-t border-gray-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start mb-32">
                    {/* Brand Section */}
                    <div className="max-w-md mb-12 md:mb-0">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                A
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Attainers</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                            Start learning and <br />
                            achieve your goals today.
                        </h2>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                        <Link to="/" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Home
                        </Link>
                        <Link to="/schedules" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Exam Schedules
                        </Link>
                        <Link to="/pdfs" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Study Material
                        </Link>
                        <Link to="/updates" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Latest Updates
                        </Link>
                        <Link to="/video-lectures" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Video Lectures
                        </Link>
                        <Link to="/mock-tests" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Mock Tests
                        </Link>
                        <Link to="/blogs" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Blogs
                        </Link>
                        <Link to="/contact" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            Contact Us
                        </Link>
                    </div>
                </div>



                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Attainers. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-gray-400 hover:text-gray-600 text-sm">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-gray-600 text-sm">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
