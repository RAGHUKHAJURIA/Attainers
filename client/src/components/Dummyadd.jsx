import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dummyadd = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        newsUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/admin/news`, formData);

            if (response.data.success) {
                toast.success(response.data.message || 'News added successfully!');
                // Reset form
                setFormData({
                    title: '',
                    content: '',
                    newsUrl: ''
                });
            } else {
                toast.error(response.data.message || 'Failed to add news');
            }
        } catch (error) {
            console.error('Error adding news:', error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            content: '',
            newsUrl: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Add New Article
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Share the latest news and updates with your audience
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="title"
                                    className="block text-lg font-semibold text-gray-700 mb-3"
                                >
                                    Article Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter an engaging title for your news article..."
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Character count: {formData.title.length}
                                </p>
                            </div>

                            {/* Content Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="content"
                                    className="block text-lg font-semibold text-gray-700 mb-3"
                                >
                                    Article Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your news article content here. Be detailed and informative..."
                                    rows="12"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-vertical bg-gray-50 focus:bg-white"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Character count: {formData.content.length}
                                </p>
                            </div>

                            {/* News URL Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="newsUrl"
                                    className="block text-lg font-semibold text-gray-700 mb-3"
                                >
                                    News URL <span className="text-gray-400">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    id="newsUrl"
                                    name="newsUrl"
                                    value={formData.newsUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/source-article (optional)"
                                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Add a reference URL if this news is sourced from another website
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Publish News
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 disabled:border-gray-100 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset Form
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Writing Tips
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 text-lg">Title Best Practices:</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Keep it concise and engaging (50-60 characters)
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Use action words and numbers when relevant
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        Make it specific and descriptive
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 text-lg">Content Guidelines:</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-purple-500 mr-2">•</span>
                                        Start with the most important information
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-purple-500 mr-2">•</span>
                                        Use clear, simple language
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-purple-500 mr-2">•</span>
                                        Include facts, quotes, and supporting details
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dummyadd;