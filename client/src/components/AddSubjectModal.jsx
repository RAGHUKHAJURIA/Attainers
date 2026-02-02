import React, { useState } from 'react';

const AddSubjectModal = ({ isOpen, onClose, onAdd }) => {
    const [subjectName, setSubjectName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            subject: subjectName,
            isPlaceholder: true,
            title: `_SUBJECT_PLACEHOLDER_${subjectName}`
        });
        setSubjectName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10 border border-gray-100 animate-scaleIn">
                    <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Add New Subject</h3>
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
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Subject Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1 w-full"
                                    placeholder="e.g. Physics"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                />
                            </div>

                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSubjectModal;
