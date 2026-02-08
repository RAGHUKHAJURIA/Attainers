import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const AddTableModal = ({ isOpen, onClose, onAdd }) => {
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

    if (!isOpen) return null;

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

        try {
            // If onAdd is provided (from TablesPage), use it. 
            // Otherwise fall back to direct createContent (though TablesPage usually handles refresh)
            // Actually, for consistency with other modals, let's defer the API call to the parent or do it here and just notify parent.
            // But TableForm did it directly. Let's do it directly here to reuse logic, then call onAdd() to refresh.

            const result = await createContent('tables', tableData);

            if (result) {
                if (onAdd) onAdd(); // Notify parent to refresh
                setFormData({
                    title: '',
                    description: '',
                    category: 'exam-schedule',
                    headers: '',
                    data: '',
                    source: ''
                });
                onClose();
            }
        } catch (error) {
            console.error('Error creating table:', error);
            alert('Failed to create table');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                {/* Modal Panel */}
                <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10 border border-gray-100 animate-scaleIn">
                    <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Add New Table</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto px-1">
                            {/* Title & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="modern-input w-full"
                                        placeholder="e.g. JKSSB Exam Dates"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="modern-select w-full"
                                    >
                                        {categories.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="2"
                                    className="modern-input w-full"
                                    placeholder="Brief description..."
                                />
                            </div>

                            {/* Headers */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Column Headers (comma separated) *</label>
                                <input
                                    type="text"
                                    name="headers"
                                    value={formData.headers}
                                    onChange={handleChange}
                                    required
                                    className="modern-input w-full"
                                    placeholder="Date, Exam Name, Status"
                                />
                            </div>

                            {/* Data */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Data (comma separated columns, new line for rows) *</label>
                                <textarea
                                    name="data"
                                    value={formData.data}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="modern-input w-full font-mono text-sm"
                                    placeholder="10-Oct-2025, Junior Assistant, Scheduled&#10;12-Nov-2025, SI Exam, Tentative"
                                />
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Source (Optional)</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="modern-input w-full"
                                    placeholder="Official Notification No..."
                                />
                            </div>

                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating...' : 'Create Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTableModal;
