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
        year: year || ''
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
            year: year || ''
        });
        onClose();
    };

    const modalTitle = isPYQ ? `Add New PYQ Test (${year})` : 'Add New Mock Test';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{modalTitle}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Test Type - Only show if not in PYQ mode */}
                            {!isPYQ && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Test Type</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.testType}
                                        onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                                    >
                                        <option value="mock-test">Mock Test</option>
                                        <option value="pyq">Previous Year Questions (PYQ)</option>
                                    </select>
                                </div>
                            )}

                            {/* Year - Only show for PYQ tests and if not pre-filled */}
                            {formData.testType === 'pyq' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {!year && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Year</label>
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
                                        <label className="block text-sm font-medium text-gray-700">Month (Optional)</label>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Title</label>
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
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="modern-input mt-1 w-full"
                                    rows="2"
                                    placeholder="Brief description of the test"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exam Category</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Questions</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
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
                                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
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

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                >
                                    Add Test
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

export default AddTestModal;
