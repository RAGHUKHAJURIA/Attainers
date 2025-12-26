import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const UpdateForm = () => {
    const { createContent } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'general',
        priority: 1,
        expiryDate: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateTypes = [
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
        { value: 'important', label: 'Important', color: 'text-orange-600' },
        { value: 'general', label: 'General', color: 'text-blue-600' },
        { value: 'maintenance', label: 'Maintenance', color: 'text-gray-600' }
    ];

    const priorities = [
        { value: 1, label: 'Low Priority' },
        { value: 2, label: 'Medium Priority' },
        { value: 3, label: 'High Priority' },
        { value: 4, label: 'Critical Priority' },
        { value: 5, label: 'Emergency' }
    ];

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

        const updateData = {
            ...formData,
            priority: parseInt(formData.priority),
            expiryDate: formData.expiryDate || null
        };

        const result = await createContent('updates', updateData);

        if (result) {
            setFormData({
                title: '',
                content: '',
                type: 'general',
                priority: 1,
                expiryDate: ''
            });
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            content: '',
            type: 'general',
            priority: 1,
            expiryDate: ''
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-2xl">🔔</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create Update</h2>
                            <p className="text-purple-100">Share important announcements and notifications</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Update Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter a clear and concise title..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.title.length}
                        </p>
                    </div>

                    {/* Type and Priority Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                                Update Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                                required
                            >
                                {updateTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
                                Priority Level
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            >
                                {priorities.map(priority => (
                                    <option key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Content Field */}
                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                            Update Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your update content here. Be clear and informative..."
                            rows="8"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.content.length}
                        </p>
                    </div>

                    {/* Expiry Date Field */}
                    <div className="space-y-2">
                        <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700">
                            Expiry Date <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                        />
                        <p className="text-xs text-gray-500">
                            Leave empty if the update should remain active indefinitely
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
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
                                    Publish Update
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
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Update Guidelines
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Update Types:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li><span className="text-red-600 font-medium">Urgent:</span> Critical announcements</li>
                                <li><span className="text-orange-600 font-medium">Important:</span> Significant updates</li>
                                <li><span className="text-blue-600 font-medium">General:</span> Regular information</li>
                                <li><span className="text-gray-600 font-medium">Maintenance:</span> System updates</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Best Practices:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use clear, actionable language</li>
                                <li>• Include relevant dates and deadlines</li>
                                <li>• Set appropriate priority levels</li>
                                <li>• Use expiry dates for time-sensitive updates</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateForm;

