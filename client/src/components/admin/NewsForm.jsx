import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const NewsForm = () => {
    const { createContent } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        newsUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            return;
        }

        setIsLoading(true);
        const result = await createContent('news', formData);

        if (result) {
            setFormData({ title: '', content: '', newsUrl: '' });
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setFormData({ title: '', content: '', newsUrl: '' });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-2xl">📰</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Add News Article</h2>
                            <p className="text-blue-100">Share the latest news and updates with your audience</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Article Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title for your news article..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.title.length}
                        </p>
                    </div>

                    {/* Content Field */}
                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                            Article Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your news article content here. Be detailed and informative..."
                            rows="8"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.content.length}
                        </p>
                    </div>

                    {/* News URL Field */}
                    <div className="space-y-2">
                        <label htmlFor="newsUrl" className="block text-sm font-semibold text-gray-700">
                            Source URL <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            id="newsUrl"
                            name="newsUrl"
                            value={formData.newsUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/source-article"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                        <p className="text-xs text-gray-500">
                            Add a reference URL if this news is sourced from another website
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
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
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Writing Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Title Best Practices:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Keep it concise and engaging (50-60 characters)</li>
                                <li>• Use action words and numbers when relevant</li>
                                <li>• Make it specific and descriptive</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Content Guidelines:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Start with the most important information</li>
                                <li>• Use clear, simple language</li>
                                <li>• Include facts, quotes, and supporting details</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsForm;

