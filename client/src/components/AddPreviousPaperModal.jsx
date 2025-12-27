import React, { useState } from 'react';

const AddPreviousPaperModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        examName: '',
        year: new Date().getFullYear(),
        subject: '',
        category: 'upsc',
        paperType: 'prelims',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        pages: 0,
        difficulty: 'medium',
        isPaid: false,
        price: 0
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            year: parseInt(formData.year),
            fileName: formData.fileName || formData.title + '.pdf',
            fileSize: parseInt(formData.fileSize) || 1024 * 1024, // Default 1MB dummy
            pages: parseInt(formData.pages) || 1,
            price: formData.isPaid ? parseFloat(formData.price) : 0
        };
        onAdd(finalData);
        setFormData({
            title: '',
            examName: '',
            year: new Date().getFullYear(),
            subject: '',
            category: 'upsc',
            paperType: 'prelims',
            fileUrl: '',
            fileName: '',
            fileSize: 0,
            pages: 0,
            difficulty: 'medium',
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add Previous Year Paper</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Paper Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="e.g. UPSC CSE Prelims 2023 GS Paper 1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="modern-input mt-1"
                                        placeholder="e.g. UPSC CSE"
                                        value={formData.examName}
                                        onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year</label>
                                    <input
                                        type="number"
                                        required
                                        className="modern-input mt-1"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="upsc">UPSC</option>
                                        <option value="ssc">SSC</option>
                                        <option value="banking">Banking</option>
                                        <option value="railway">Railway</option>
                                        <option value="defense">Defense</option>
                                        <option value="state-psc">State PSC</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Paper Type</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.paperType}
                                        onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                                    >
                                        <option value="prelims">Prelims</option>
                                        <option value="mains">Mains</option>
                                        <option value="interview">Interview</option>
                                        <option value="written">Written</option>
                                        <option value="objective">Objective</option>
                                        <option value="subjective">Subjective</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="e.g. General Studies, History"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">File URL</label>
                                <input
                                    type="url"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="https://..."
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                />
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
                                    Add Paper
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

export default AddPreviousPaperModal;
