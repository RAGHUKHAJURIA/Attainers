import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const YouTubeForm = () => {
    const { createContent } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        category: 'tutorial',
        tags: '',
        isFeatured: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const categories = [
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'exam-guidance', label: 'Exam Guidance' },
        { value: 'current-affairs', label: 'Current Affairs' },
        { value: 'motivation', label: 'Motivation' },
        { value: 'general', label: 'General' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handlePreview = () => {
        const videoId = extractVideoId(formData.videoUrl);
        if (videoId) {
            setPreviewData({
                videoId,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`
            });
        } else {
            setPreviewData(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim() || !formData.videoUrl.trim()) {
            return;
        }

        const videoId = extractVideoId(formData.videoUrl);
        if (!videoId) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        setIsLoading(true);

        // Convert tags string to array
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const videoData = {
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            category: formData.category,
            tags: tagsArray,
            isFeatured: formData.isFeatured
        };

        const result = await createContent('youtube', videoData);

        if (result) {
            setFormData({
                title: '',
                description: '',
                videoUrl: '',
                category: 'tutorial',
                tags: '',
                isFeatured: false
            });
            setPreviewData(null);
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            videoUrl: '',
            category: 'tutorial',
            tags: '',
            isFeatured: false
        });
        setPreviewData(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-pink-700 px-8 py-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-2xl">🎥</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Add YouTube Video</h2>
                            <p className="text-red-100">Share your YouTube videos with your audience</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Video URL Field */}
                    <div className="space-y-2">
                        <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700">
                            YouTube Video URL <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                id="videoUrl"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                required
                            />
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                            >
                                Preview
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Paste the YouTube video URL to automatically extract video information
                        </p>
                    </div>

                    {/* Preview Section */}
                    {previewData && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Video Preview:</h4>
                            <div className="flex gap-4">
                                <img
                                    src={previewData.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-32 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Video ID: {previewData.videoId}</p>
                                    <p className="text-xs text-gray-500">Thumbnail loaded successfully</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Video Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title for your video..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.title.length}
                        </p>
                    </div>

                    {/* Category and Featured Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Video Options
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                                    Mark as Featured Video
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Video Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write a detailed description of your video content..."
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.description.length}
                        </p>
                    </div>

                    {/* Tags Field */}
                    <div className="space-y-2">
                        <label htmlFor="tags" className="block text-sm font-semibold text-gray-700">
                            Tags <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="tag1, tag2, tag3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                        />
                        <p className="text-xs text-gray-500">
                            Separate tags with commas to help users find your video
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Video
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-gray-300 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Form
                        </button>
                    </div>
                </form>

                {/* Tips Section */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        YouTube Integration Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Supported URLs:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                                <li>• https://youtu.be/VIDEO_ID</li>
                                <li>• https://youtube.com/embed/VIDEO_ID</li>
                                <li>• https://youtube.com/v/VIDEO_ID</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Best Practices:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use descriptive titles and descriptions</li>
                                <li>• Add relevant tags for better discoverability</li>
                                <li>• Mark important videos as featured</li>
                                <li>• Ensure video is public on YouTube</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeForm;

