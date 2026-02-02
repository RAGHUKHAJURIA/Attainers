import React from 'react';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="relative w-full min-h-[85vh] bg-white overflow-hidden flex flex-col items-center justify-center pt-20 pb-16">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: '0.2'
                }}>
            </div>

            {/* Central Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-8">
                {/* Floating Central Logo */}
                <div className="w-20 h-20 mx-auto mb-8 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 animate-bounce-slow">
                    <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full" />
                </div>

                <div className="inline-block px-4 py-1.5 mb-6 text-xs sm:text-sm font-semibold tracking-wide text-blue-700 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                    An initiative by the Collaboration of Attainers x D Latest info
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                    Prepare, Track, and <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Achieve Your Dreams
                    </span>
                </h1>

                <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    The ultimate platform for J&K Exam preparation. Access high-quality PDFs,
                    video lectures, and previous papers all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
                    <Link to="/courses" className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300 text-center">
                        Start Learning Free
                    </Link>
                    <Link to="/mock-tests" className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Mock Test
                    </Link>
                    <Link to="/current-affairs" className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        J & K Current Affairs
                    </Link>
                </div>
            </div>

            {/* Floating Elements (Visible on large screens) */}
            <div className="absolute inset-0 pointer-events-none hidden xl:block max-w-[1400px] mx-auto">

                {/* Left Top: Yellow Sticky Note - Study Plan */}
                <div className="absolute top-1/4 left-10 transform -rotate-6 transition-transform hover:-rotate-3 duration-300 pointer-events-auto">
                    <div className="w-56 h-auto bg-[#fef08a] rounded-sm shadow-xl p-6 relative font-handwriting">
                        {/* Pin */}
                        <div className="absolute -top-3 left-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md z-20 border-2 border-white/30"></div>
                        <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-800/20 pb-2">Top Priorities</h3>
                        <ul className="space-y-3 font-medium text-sm text-gray-800">
                            <li className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-gray-800 rounded-sm"></span>
                                <span>JKSSB Revision</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-800 border-2 border-gray-800 rounded-sm flex items-center justify-center text-white text-xs">✓</span>
                                <span className="line-through decoration-2 opacity-60">Watch History Lec</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-gray-800 rounded-sm"></span>
                                <span>Download PDFs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Top: Social Media Hub */}
                <div className="absolute top-20 right-20 transform rotate-3 transition-transform hover:rotate-6 duration-300 pointer-events-auto">
                    <div className="w-64 bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-800">Connect</h4>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Online</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            {/* YouTube */}
                            <a href="https://www.youtube.com/@weattainers" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-500">YT</span>
                            </a>
                            {/* Instagram */}
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-500">Insta</span>
                            </a>
                            {/* Telegram */}
                            <a href="https://telegram.me/weareattainers" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-500">Telegram</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Left Bottom: Study Resources */}
                <div className="absolute bottom-12 left-20 transform rotate-3 transition-transform hover:rotate-0 duration-300 pointer-events-auto">
                    <Link to="/pdfs" className="block w-60 bg-white rounded-3xl shadow-2xl p-5 border border-gray-200 hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 text-xl">📁</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Study Resources</h4>
                                <p className="text-xs text-gray-500">12 New Files</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
                            </div>
                            <p className="text-right text-xs font-bold text-indigo-500">75% Downloaded</p>
                        </div>
                    </Link>
                </div>

                {/* Right Bottom: Mock Test Card */}
                {/* MOVED TO BOTTOM RIGHT AS REQUESTED, REPLACING OVERLAPPING POSITION */}
                <div className="absolute bottom-12 right-20 transform -rotate-3 transition-transform hover:rotate-0 duration-300 z-20 pointer-events-auto">
                    <div className="w-64 bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 group cursor-pointer hover:bg-blue-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                        </div>
                        {/* Title & Subtitle */}
                        <div className="mb-4">
                            <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">Weekly Mock Test</h4>
                            <p className="text-sm text-gray-500">Test your preparation</p>
                        </div>
                        {/* Start Now Button */}
                        <Link to="/mock-tests" className="block w-full text-center py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition-colors">
                            Start Now
                        </Link>
                    </div>
                </div>

            </div>

            <style>{`
                .font-handwriting {
                    font-family: 'Kalam', cursive, sans-serif;
                }
                @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
            `}</style>
        </section>
    );
};

export default ModernHero;
