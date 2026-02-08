import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import YouTubeCard from './YouTubeCard';

const YouTubeSection = () => {
    const { allYouTubeVideos, fetchAllYouTubeVideos } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFeatured, setShowFeatured] = useState(false);

    const categories = [
        { value: 'all', label: 'All Videos' },
        { value: 'tutorial', label: 'Tutorials' },
        { value: 'exam-guidance', label: 'Exam Guidance' },
        { value: 'current-affairs', label: 'Current Affairs' },
        { value: 'motivation', label: 'Motivation' },
        { value: 'general', label: 'General' }
    ];

    useEffect(() => {
        fetchAllYouTubeVideos();
    }, []);

    const filteredVideos = allYouTubeVideos.filter(video => {
        if (showFeatured && !video.isFeatured) return false;
        if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
        return true;
    });

    const featuredVideos = allYouTubeVideos.filter(video => video.isFeatured);

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Free Youtube Lectures
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Watch our comprehensive video tutorials, exam guidance, and educational content to enhance your learning experience.
                    </p>
                </div>

                {/* Featured Videos Section */}
                {featuredVideos.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                <span className="text-yellow-500 mr-2">⭐</span>
                                Featured Videos
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredVideos.slice(0, 3).map((video) => (
                                <YouTubeCard key={video._id} video={video} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.value
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showFeatured}
                                onChange={(e) => setShowFeatured(e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show only featured</span>
                        </label>
                    </div>
                </div>

                {/* Videos Grid */}
                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVideos.map((video) => (
                            <YouTubeCard key={video._id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                        <p className="text-gray-500">
                            {selectedCategory !== 'all' || showFeatured
                                ? 'Try adjusting your filters to see more videos'
                                : 'Check back later for new educational content'
                            }
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {allYouTubeVideos.length}
                            </div>
                            <div className="text-gray-600">Total Videos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {featuredVideos.length}
                            </div>
                            <div className="text-gray-600">Featured Videos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {allYouTubeVideos.reduce((total, video) => total + video.views, 0)}
                            </div>
                            <div className="text-gray-600">Total Views</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default YouTubeSection;

