import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import BlogCard from './BlogCard';

const BlogSection = () => {
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
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Educational Blogs
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Dive deep into comprehensive study guides, career advice, and expert insights to help you succeed in your academic and professional journey.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.value
                                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
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
                        <p className="text-gray-500">
                            {selectedCategory !== 'all'
                                ? 'Try selecting a different category'
                                : 'Check back later for new blog posts'
                            }
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {allBlogs.length}
                            </div>
                            <div className="text-gray-600">Total Posts</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {allBlogs.filter(blog => blog.category === 'study-material').length}
                            </div>
                            <div className="text-gray-600">Study Materials</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {allBlogs.filter(blog => blog.category === 'career-guidance').length}
                            </div>
                            <div className="text-gray-600">Career Guides</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {allBlogs.reduce((total, blog) => total + blog.views, 0)}
                            </div>
                            <div className="text-gray-600">Total Views</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;

