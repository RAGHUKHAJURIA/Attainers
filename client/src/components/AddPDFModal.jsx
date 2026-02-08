import React, { useState } from 'react';

const AddPDFModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'study-material',
        subject: 'General',
        fileUrl: '',
        file: null, // For uploaded file
        fileName: '',
        fileSize: 0,
        pages: 0,
        isPaid: false,
        price: 0
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Auto-generate some metadata if not provided
        const finalData = {
            ...formData,
            fileName: formData.fileName || formData.title + '.pdf',
            fileSize: parseInt(formData.fileSize) || 1024 * 1024, // Default 1MB dummy
            pages: parseInt(formData.pages) || 1,
            price: formData.isPaid ? parseFloat(formData.price) : 0
        };
        onAdd(finalData);
        setFormData({
            title: '',
            description: '',
            category: 'study-material',
            subject: 'General',
            fileUrl: '',
            file: null,
            fileName: '',
            fileSize: 0,
            pages: 0,
            isPaid: false,
            price: 0
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New PDF Resource</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="e.g. NCERT Math Solutions"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="modern-input mt-1 w-full"
                                    rows="2"
                                    placeholder="Brief description of the PDF"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="study-material">Study Material</option>
                                        <option value="syllabus">Syllabus</option>
                                        <option value="notes">Notes</option>
                                        <option value="reference-books">Reference Books</option>
                                        <option value="question-banks">Question Banks</option>
                                        <option value="solved-papers">Solved Papers</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="PYQs">PYQs</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload File (PDF) OR File URL</label>
                                <div className="mt-1 space-y-2">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0], fileUrl: '' })} // Clear URL if file selected
                                    />
                                    <div className="text-center text-gray-400 text-sm">- OR -</div>
                                    <input
                                        type="url"
                                        className="modern-input"
                                        placeholder="https://... (Google Drive/Dropbox)"
                                        value={formData.fileUrl}
                                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value, file: null })} // Clear file if URL entered
                                        disabled={!!formData.file}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Page Count (Optional)</label>
                                    <input
                                        type="number"
                                        className="modern-input mt-1"
                                        value={formData.pages}
                                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (if paid)</label>
                                    <div className="flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                                            checked={formData.isPaid}
                                            onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                        />
                                        <input
                                            type="number"
                                            disabled={!formData.isPaid}
                                            className="modern-input flex-1 disabled:bg-gray-100 disabled:text-gray-400"
                                            placeholder="Price in ₹"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                >
                                    Add PDF
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPDFModal;
