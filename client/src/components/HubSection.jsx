import React from 'react';
import { Link } from 'react-router-dom';

const HubSection = () => {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        All your study materials, updates, and resources in one organized place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Top Left: Latest Updates (Visual: Notification List) */}
                    <Link to="/updates" className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center overflow-hidden relative">
                        {/* Abstract UI Visual */}
                        <div className="w-[85%] bg-gray-50 rounded-2xl p-4 mb-8 transform group-hover:scale-105 transition-transform duration-500 ease-out border border-gray-100/50">
                            {/* Fake Notification Items */}
                            <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">NEW</div>
                                <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-100 flex items-center gap-3 opacity-80">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">JKSSB</div>
                                <div className="h-2 w-32 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">Exam</div>
                                <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                            Latest Updates
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            Real-time notifications about exams, results, and important announcements.
                        </p>
                    </Link>

                    {/* Top Right: Schedules (Visual: Calendar/Table) */}
                    <Link to="/schedules" className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Abstract UI Visual */}
                        <div className="w-[85%] bg-gray-50 rounded-2xl p-5 mb-8 transform group-hover:scale-105 transition-transform duration-500 ease-out border border-gray-100/50">
                            <div className="flex justify-between mb-4">
                                <div className="w-16 h-8 bg-white rounded-lg shadow-sm"></div>
                                <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 font-bold text-xs flex-col">
                                    <span>15</span>
                                </div>
                                <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                                <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                                <div className="h-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-500 font-bold text-xs flex-col">
                                    <span>18</span>
                                </div>
                                <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                                <div className="h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-500 font-bold text-xs flex-col">
                                    <span>22</span>
                                </div>
                                <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                                <div className="h-16 bg-white rounded-xl border border-gray-100"></div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            Exam Schedules & Data
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            Keep track of important dates, syllabus, and download data tables.
                        </p>
                    </Link>

                    {/* Bottom Left: Videos (Visual: Landscape Layout) */}
                    <Link to="/video-lectures" className="md:col-span-1 group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-6 mb-2">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    Educational Videos
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Watch & Learn
                                </p>
                            </div>
                        </div>

                        {/* Abstract Video Player Visual */}
                        <div className="mt-8 bg-gray-900 rounded-xl aspect-video w-full relative group-hover:scale-[1.02] transition-transform duration-500 shadow-lg border-4 border-gray-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-red-500 rounded-full"></div>
                            </div>
                        </div>
                    </Link>

                    {/* Bottom Right: Blogs (Visual: Widgets/Cards) */}
                    <Link to="/blogs" className="md:col-span-1 group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                    Educational Blogs
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Read comprehensive guides
                                </p>
                            </div>
                        </div>

                        {/* Abstract Widgets Visual */}
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className="bg-yellow-50 rounded-2xl p-4 transform group-hover:-rotate-2 transition-transform duration-300">
                                <div className="w-8 h-8 bg-white rounded-full mb-3 shadow-sm"></div>
                                <div className="h-2 w-16 bg-yellow-200 rounded-full mb-2"></div>
                                <div className="h-2 w-10 bg-yellow-200/50 rounded-full"></div>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-4 transform group-hover:rotate-2 transition-transform duration-300 mt-6">
                                <div className="w-8 h-8 bg-white rounded-full mb-3 shadow-sm"></div>
                                <div className="h-2 w-16 bg-blue-200 rounded-full mb-2"></div>
                                <div className="h-2 w-12 bg-blue-200/50 rounded-full"></div>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default HubSection;
