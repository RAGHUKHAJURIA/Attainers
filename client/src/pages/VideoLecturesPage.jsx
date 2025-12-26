import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import VideoLectureCard from '../components/VideoLectureCard';
import Footer from '../components/Footer';

const VideoLecturesPage = () => {
    const { allVideoLectures, allCourses, fetchAllVideoLectures, fetchAllCourses } = useContext(AppContext);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    useEffect(() => {
        fetchAllVideoLectures();
        fetchAllCourses();
    }, []);

    const filteredLectures = allVideoLectures.filter(lecture => {
        if (selectedCourse !== 'all' && lecture.courseId._id !== selectedCourse) return false;
        if (showFreeOnly && !lecture.isFree) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                {/* Header */}
                <div className="section-header">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">Video Lectures</h1>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Learn from comprehensive video lectures covering various subjects and exam preparations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="filter-section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Course Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="modern-select"
                                >
                                    <option value="all">All Courses</option>
                                    {allCourses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Free Filter */}
                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showFreeOnly}
                                        onChange={(e) => setShowFreeOnly(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">Show free lectures only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Video Lectures Grid */}
                    {filteredLectures.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredLectures.map((lecture) => (
                                <VideoLectureCard key={lecture._id} lecture={lecture} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No video lectures found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more content</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-section">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allVideoLectures.length}
                                </div>
                                <div className="text-gray-600">Total Lectures</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allVideoLectures.filter(lecture => lecture.isFree).length}
                                </div>
                                <div className="text-gray-600">Free Lectures</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    {allCourses.length}
                                </div>
                                <div className="text-gray-600">Total Courses</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {allVideoLectures.reduce((total, lecture) => total + lecture.viewCount, 0)}
                                </div>
                                <div className="text-gray-600">Total Views</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VideoLecturesPage;

