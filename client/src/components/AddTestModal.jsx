import React, { useState, useEffect } from 'react';

const AddTestModal = ({ isOpen, onClose, onAdd, isPYQ = false, year = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        examName: '',
        totalQuestions: '',
        duration: '',
        difficulty: 'Medium',
        description: '',
        testType: isPYQ ? 'pyq' : 'mock-test',
        year: year || '',
        month: '',
        subject: '',
        exam: '',
        subExam: ''
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

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            totalQuestions: parseInt(formData.totalQuestions, 10),
            duration: parseInt(formData.duration, 10)
        };

        // Add year for PYQ tests
        if (formData.testType === 'pyq') {
            submitData.year = parseInt(formData.year, 10);
        }

        onAdd(submitData);
        setFormData({
            title: '',
            examName: '',
            totalQuestions: '',
            duration: '',
            difficulty: 'Medium',
            description: '',
            testType: isPYQ ? 'pyq' : 'mock-test',
            year: year || '',
            month: '',
            subject: '',
            exam: '',
            subExam: ''
        });
        onClose();
    };

    const modalTitle = isPYQ ? `Add New PYQ Test (${year})` : 'Add New Mock Test';

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
                            {/* Test Type - Only show if not in PYQ mode */}
                            {!isPYQ && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Test Type</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.testType}
                                        onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                                    >
                                        <option value="mock-test">Mock Test</option>
                                        <option value="current-affairs">Current Affairs</option>
                                        <option value="subject-wise">Subject-wise</option>
                                        <option value="exam-wise">Exam-wise</option>
                                        <option value="pyq">Previous Year Questions (PYQ)</option>
                                    </select>
                                </div>
                            )}

                            {/* Year - Only show for PYQ tests and if not pre-filled */}
                            {formData.testType === 'pyq' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {!year && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">Year</label>
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
                                    )}
                                    <div className={year ? "col-span-2" : ""}>
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

                            {/* Subject - Only show for subject-wise tests */}
                            {formData.testType === 'subject-wise' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Subject</label>
                                    <select
                                        required
                                        className="modern-select mt-1"
                                        value={formData.subject || ''}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="">Select Subject</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="History">History</option>
                                        <option value="Geography">Geography</option>
                                        <option value="Politics">Politics</option>
                                        <option value="General Knowledge">General Knowledge</option>
                                    </select>
                                </div>
                            )}

                            {/* Exam - Only show for exam-wise tests */}
                            {formData.testType === 'exam-wise' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Exam</label>
                                    <select
                                        required
                                        className="modern-select mt-1"
                                        value={formData.exam || ''}
                                        onChange={(e) => setFormData({ ...formData, exam: e.target.value, subExam: '' })}
                                    >
                                        <option value="">Select Exam</option>
                                        <option value="JKSSB">JKSSB</option>
                                        <option value="JKP">JKP</option>
                                        <option value="SSC">SSC</option>
                                    </select>
                                </div>
                            )}

                            {/* Sub-Exam - Only show for JKSSB exam */}
                            {formData.testType === 'exam-wise' && formData.exam === 'JKSSB' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">JKSSB Exam Type</label>
                                    <select
                                        required
                                        className="modern-select mt-1"
                                        value={formData.subExam || ''}
                                        onChange={(e) => setFormData({ ...formData, subExam: e.target.value })}
                                    >
                                        <option value="">Select Exam Type</option>
                                        <option value="SI">Sub-Inspector (SI)</option>
                                        <option value="Junior Assistant">Junior Assistant</option>
                                        <option value="Accounts Assistant">Accounts Assistant</option>
                                        <option value="Panchayat Secretary">Panchayat Secretary</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Test Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="e.g. JKSSB SI Full Mock Test 1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Exam Category</label>
                                <select
                                    required
                                    className="modern-select mt-1"
                                    value={formData.examName}
                                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                >
                                    <option value="">Select Exam</option>
                                    <option value="JKSSB SI">JKSSB SI</option>
                                    <option value="JKSSB Junior Assistant">JKSSB Junior Assistant</option>
                                    <option value="SSC CGL">SSC CGL</option>
                                    <option value="SSC CHSL">SSC CHSL</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Questions</label>
                                    <input
                                        type="number"
                                        required
                                        className="modern-input mt-1"
                                        placeholder="100"
                                        value={formData.totalQuestions}
                                        onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Duration (mins)</label>
                                    <input
                                        type="number"
                                        required
                                        className="modern-input mt-1"
                                        placeholder="120"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Difficulty</label>
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
