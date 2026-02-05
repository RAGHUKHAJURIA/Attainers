import React, { useState, useEffect } from 'react';

const AddTestModal = ({ isOpen, onClose, onAdd, isPYQ = false, year = null, isSubjectWise = false, subject = null, isExamWise = false, examName = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        examName: examName || (isSubjectWise ? '' : 'J&K Current Affairs'),
        totalQuestions: 0,
        duration: 60,
        difficulty: 'Medium',
        description: '',
        testType: isSubjectWise ? 'subject-wise' : (isExamWise ? 'exam-wise' : (isPYQ ? 'pyq' : 'current-affairs')),
        year: year || new Date().getFullYear(),
        month: '',
        isPublished: true
    });

    useEffect(() => {
        if (isPYQ && year) {
            setFormData(prev => ({
                ...prev,
                testType: 'pyq',
                year: year
            }));
        }
    }, [isPYQ, year]);

    useEffect(() => {
        if (isExamWise && examName) {
            setFormData(prev => ({
                ...prev,
                testType: 'exam-wise',
                examName: examName
            }));
        }
    }, [isExamWise, examName]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        let generatedTitle = '';
        if (isSubjectWise) {
            generatedTitle = `${subject} Mock Test`;
        } else if (isExamWise) {
            generatedTitle = `${formData.examName} Mock Test`;
        } else if (isPYQ) {
            generatedTitle = `${formData.examName} PYQ ${formData.year}`;
        } else {
            // Current Affairs
            generatedTitle = `J&K ${formData.month ? formData.month + ' ' : ''}Current Affairs ${formData.year}`;
        }

        const submitData = {
            ...formData,
            title: generatedTitle,
            totalQuestions: 0,
            duration: parseInt(formData.duration, 10),
            year: parseInt(formData.year, 10)
        };

        onAdd(submitData);
        setFormData({
            title: '',
            examName: 'J&K Current Affairs',
            totalQuestions: 0,
            duration: 60,
            difficulty: 'Medium',
            description: '',
            testType: isPYQ ? 'pyq' : 'current-affairs',
            year: year || new Date().getFullYear(),
            month: '',
            isPublished: true
        });
        onClose();
    };

    const modalTitle = isSubjectWise ? `Add Subject Mock Test (${subject})`
        : (isExamWise ? `Add Exam Mock Test (${examName})`
            : (isPYQ ? `Add New PYQ Test (${year})`
                : 'Add New J & K Current Affairs Test'));

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop with blur effect */}
                <div
                    className="fixed inset-0 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                {/* Modal container with modern styling */}
                <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10 border border-gray-100 animate-scaleIn">
                    <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{modalTitle}</h3>
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
                            {/* Year and Month */}
                            {!isSubjectWise && !isExamWise && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Year *</label>
                                        <input
                                            type="number"
                                            required
                                            className="modern-input mt-1"
                                            placeholder="2025"
                                            min="2020"
                                            max="2030"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">Month (Optional)</label>
                                        <select
                                            className="modern-select mt-1"
                                            value={formData.month || ''}
                                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                        >
                                            <option value="">Select Month</option>
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {isSubjectWise && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="modern-input mt-1 bg-gray-50 text-gray-500"
                                        value={subject || ''}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Exam Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1 w-full"
                                    placeholder="e.g. JKSSB SI"
                                    value={formData.examName}
                                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                                <textarea
                                    className="modern-input mt-1 w-full"
                                    rows="2"
                                    placeholder="Brief description of the test"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Duration (mins) *</label>
                                <input
                                    type="number"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="60"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Difficulty *</label>
                                <select
                                    className="modern-select mt-1"
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Visibility Status *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 flex-1">
                                        <input
                                            type="radio"
                                            name="modalIsPublished"
                                            value="true"
                                            checked={formData.isPublished === true}
                                            onChange={() => setFormData({ ...formData, isPublished: true })}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Publish Now</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 flex-1">
                                        <input
                                            type="radio"
                                            name="modalIsPublished"
                                            value="false"
                                            checked={formData.isPublished === false}
                                            onChange={() => setFormData({ ...formData, isPublished: false })}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Private</span>
                                    </label>
                                </div>
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
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Add Test
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTestModal;
