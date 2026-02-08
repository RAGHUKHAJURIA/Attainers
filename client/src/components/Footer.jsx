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
                            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
                            <span className="text-2xl font-bold text-gray-900">Attainers</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-8">
                            Start learning and <br />
                            achieve your goals today.
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">YouTube Channels</h3>
                                <div className="flex flex-col gap-2">
                                    <a href="https://www.youtube.com/@weattainers" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                        </div>
                                        <span className="font-medium text-sm">We Are Attainers</span>
                                    </a>
                                    <a href="https://www.youtube.com/@DLatestinfo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                        </div>
                                        <span className="font-medium text-sm">D Latest Info</span>
                                    </a>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Telegram Channels</h3>
                                <div className="flex flex-col gap-2">
                                    <a href="https://telegram.me/weareattainers" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                        </div>
                                        <span className="font-medium text-sm">We Are Attainers</span>
                                    </a>
                                    <a href="https://t.me/DLatestinfo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                        </div>
                                        <span className="font-medium text-sm">D Latest Info</span>
                                    </a>
                                </div>
                            </div>
                        </div>
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
                        <Link to="/youtube" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
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
