import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

const CoursesPage = () => {
    const { allCourses, fetchAllCourses } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [showFeatured, setShowFeatured] = useState(false);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'government-exams', label: 'Government Exams' },
        { value: 'competitive-exams', label: 'Competitive Exams' },
        { value: 'academic', label: 'Academic' },
        { value: 'skill-development', label: 'Skill Development' },
        { value: 'language', label: 'Language' },
        { value: 'certification', label: 'Certification' }
    ];

    const levels = [
        { value: 'all', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
    ];

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const filteredCourses = allCourses.filter(course => {
        if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;
        if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
        if (showFeatured && !course.isFeatured) return false;
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">Courses</h1>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Enroll in comprehensive courses designed to help you achieve your educational and career goals.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="filter-section">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="modern-select"
                                >
                                    {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="modern-select"
                                >
                                    {levels.map(level => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Featured Filter */}
                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showFeatured}
                                        onChange={(e) => setShowFeatured(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">Show featured courses only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more content</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-section">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allCourses.length}
                                </div>
                                <div className="text-gray-600">Total Courses</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    {allCourses.filter(course => course.isFeatured).length}
                                </div>
                                <div className="text-gray-600">Featured Courses</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {allCourses.reduce((total, course) => total + course.enrollmentCount, 0)}
                                </div>
                                <div className="text-gray-600">Total Enrollments</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allCourses.reduce((total, course) => total + course.videoCount, 0)}
                                </div>
                                <div className="text-gray-600">Total Videos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;

