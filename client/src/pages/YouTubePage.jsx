import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import YouTubeCard from '../components/YouTubeCard';
import Footer from '../components/Footer';
import AddYouTubeModal from '../components/AddYouTubeModal';
import CardSkeleton from '../components/CardSkeleton';
import { useUser, useAuth } from '@clerk/clerk-react';

const YouTubePage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Tutorial', 'Exam Guidance', 'J & K Current Affairs', 'Motivation', 'General'];

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const fetchVideos = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/youtube');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setVideos(data.videos);
                }
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideo = async (newVideo) => {
        try {
            const token = await getToken();
            const response = await fetch('https://attainers-272i.vercel.app/api/admin/youtube', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newVideo)
            });

            if (response.ok) {
                fetchVideos();
            } else {
                const errData = await response.json();
                alert(`Failed to add video: ${errData.message}`);
            }
        } catch (error) {
            console.error('Error adding video:', error);
            alert("Error adding video.");
        }
    };

    const handleSyncVideos = async () => {
        const channelId = prompt("Enter your YouTube Channel ID (e.g., UC...):");
        if (!channelId) return;

        try {
            const token = await getToken();
            const response = await fetch('https://attainers-272i.vercel.app/api/admin/youtube/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ channelId })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchVideos();
            } else {
                alert(`Sync failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error syncing videos:', error);
            alert("Error syncing videos.");
        }
    };

    const handleFixThumbnails = async () => {
        if (!confirm("This will update all video thumbnails. Continue?")) return;

        try {
            const token = await getToken();
            const response = await fetch('https://attainers-272i.vercel.app/api/admin/youtube/fix-thumbnails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchVideos();
            } else {
                alert(`Fix failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fixing thumbnails:', error);
            alert("Error fixing thumbnails.");
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`https://attainers-272i.vercel.app/api/admin/youtube/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from local state immediately
                setVideos(videos.filter(video => video._id !== id));
            } else {
                const data = await response.json();
                alert(`Delete failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            alert("Error deleting video.");
        }
    };

    const handleDeleteShorts = async () => {
        if (!confirm("This will permanently delete all YouTube Shorts. Continue?")) return;

        try {
            const token = await getToken();
            const response = await fetch('https://attainers-272i.vercel.app/api/admin/youtube/delete-shorts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchVideos();
            } else {
                const data = await response.json();
                alert(`Delete failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error deleting shorts:', error);
            alert("Error deleting shorts.");
        }
    };

    // Filtering Logic
    const filteredVideos = videos.filter(video => {
        const matchesCategory = selectedCategory === 'All' || video.category.toLowerCase() === selectedCategory.toLowerCase().replace(' ', '-');
        const matchesFeatured = showFeaturedOnly ? video.isFeatured : true;
        return matchesCategory && matchesFeatured;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-red-600 text-4xl">▶</span> YouTube Library
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Curated video content to supplement your learning.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Featured Toggle */}
                        <label className="flex items-center cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={showFeaturedOnly}
                                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Featured Only</span>
                        </label>

                        {isAdmin && (
                            <>
                                <button
                                    onClick={handleSyncVideos}
                                    className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Sync Videos
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-red-600 hover:bg-red-700 border-red-600"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Video
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-red-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVideos.map((video) => (
                            <YouTubeCard
                                key={video._id}
                                video={video}
                                isAdmin={isAdmin}
                                onDelete={handleDeleteVideo}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
                    </div>
                )}
            </main>

            <Footer />

            <AddYouTubeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddVideo}
            />
        </div>
    );
};

export default YouTubePage;
