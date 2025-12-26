import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';

const BlogsPage = () => {
    const { allBlogs, fetchAllBlogs } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All Posts' },
        { value: 'study-material', label: 'Study Material' },
        { value: 'career-guidance', label: 'Career Guidance' },
        { value: 'government-jobs', label: 'Government Jobs' },
        { value: 'exam-updates', label: 'Exam Updates' },
        { value: 'general', label: 'General' }
    ];

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    const filteredBlogs = selectedCategory === 'all'
        ? allBlogs
        : allBlogs.filter(blog => blog.category === selectedCategory);

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">Educational Blogs</h1>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Read comprehensive articles, study guides, and expert insights to enhance your learning journey.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="filter-section">
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.value
                                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Blogs Grid */}
                    {filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                            <p className="text-gray-500">Try selecting a different category</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-section">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allBlogs.length}
                                </div>
                                <div className="text-gray-600">Total Posts</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    {allBlogs.filter(blog => blog.category === 'study-material').length}
                                </div>
                                <div className="text-gray-600">Study Materials</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {allBlogs.filter(blog => blog.category === 'career-guidance').length}
                                </div>
                                <div className="text-gray-600">Career Guides</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allBlogs.reduce((total, blog) => total + blog.views, 0)}
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

export default BlogsPage;
