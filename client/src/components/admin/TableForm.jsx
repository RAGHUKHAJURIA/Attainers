import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const TableForm = () => {
    const { createContent } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'exam-schedule',
        headers: '',
        data: '',
        source: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { value: 'exam-schedule', label: 'Exam Schedule' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'results', label: 'Results' },
        { value: 'admit-cards', label: 'Admit Cards' },
        { value: 'notifications', label: 'Notifications' },
        { value: 'cutoff-marks', label: 'Cutoff Marks' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const parseTableData = (headersStr, dataStr) => {
        const headers = headersStr.split(',').map(h => h.trim()).filter(h => h);
        const rows = dataStr.split('\n').filter(row => row.trim());

        const data = rows.map(row => {
            const cells = row.split(',').map(cell => cell.trim());
            return { row: cells };
        });

        return { headers, data };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim() || !formData.headers.trim() || !formData.data.trim()) {
            return;
        }

        setIsLoading(true);

        const { headers, data } = parseTableData(formData.headers, formData.data);

        const tableData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            headers,
            data,
            source: formData.source
        };

        const result = await createContent('tables', tableData);

        if (result) {
            setFormData({
                title: '',
                description: '',
                category: 'exam-schedule',
                headers: '',
                data: '',
                source: ''
            });
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            category: 'exam-schedule',
            headers: '',
            data: '',
            source: ''
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create Data Table</h2>
                            <p className="text-yellow-100">Add structured data like exam schedules and results</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title and Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                Table Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter table title..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what this table contains..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                    </div>

                    {/* Headers Field */}
                    <div className="space-y-2">
                        <label htmlFor="headers" className="block text-sm font-semibold text-gray-700">
                            Column Headers <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="headers"
                            name="headers"
                            value={formData.headers}
                            onChange={handleChange}
                            placeholder="Header 1, Header 2, Header 3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Separate column headers with commas
                        </p>
                    </div>

                    {/* Data Field */}
                    <div className="space-y-2">
                        <label htmlFor="data" className="block text-sm font-semibold text-gray-700">
                            Table Data <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="data"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                            placeholder="Row 1 Col 1, Row 1 Col 2, Row 1 Col 3&#10;Row 2 Col 1, Row 2 Col 2, Row 2 Col 3&#10;Row 3 Col 1, Row 3 Col 2, Row 3 Col 3"
                            rows="8"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 resize-vertical font-mono text-sm"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Each line represents a row. Separate columns with commas. Use line breaks for new rows.
                        </p>
                    </div>

                    {/* Source Field */}
                    <div className="space-y-2">
                        <label htmlFor="source" className="block text-sm font-semibold text-gray-700">
                            Source <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            placeholder="Official website, notification number, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Table
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
                        <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Table Creation Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Data Format:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use commas to separate columns</li>
                                <li>• Use line breaks for new rows</li>
                                <li>• Keep data consistent and clean</li>
                                <li>• Include all necessary information</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Best Practices:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use clear, descriptive headers</li>
                                <li>• Ensure data accuracy</li>
                                <li>• Include source information</li>
                                <li>• Test with sample data first</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableForm;

