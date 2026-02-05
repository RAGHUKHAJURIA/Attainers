import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const MockTestForm = ({ onSuccess, onAddQuestions, defaultTestType = 'mock-test' }) => {
    const { createContent } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdTest, setCreatedTest] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        examName: '',
        difficulty: 'Medium',
        duration: 60,
        totalQuestions: 0,
        description: '',
        negativeMarks: 0,
        testType: defaultTestType,
        year: new Date().getFullYear(),
        month: '',
        subject: '',
        exam: '',
        subExam: '',
        isPublished: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Generate Title automatically
        let generatedTitle = '';
        if (formData.testType === 'current-affairs') {
            generatedTitle = `J&K ${formData.month ? formData.month + ' ' : ''}Current Affairs ${formData.year}`;
        } else if (formData.testType === 'subject-wise') {
            generatedTitle = `${formData.subject} Mock Test`;
        } else if (formData.testType === 'exam-wise') {
            generatedTitle = `${formData.exam}${formData.subExam ? ' ' + formData.subExam : ''} Mock Test`;
        } else if (formData.testType === 'pyq') {
            generatedTitle = `${formData.examName} PYQ ${formData.year}`;
        } else {
            generatedTitle = `${formData.examName} Mock Test`;
        }

        // Prepare data based on test type
        const submitData = {
            title: generatedTitle,
            examName: formData.examName,
            difficulty: formData.difficulty,
            duration: parseInt(formData.duration),
            totalQuestions: 0, // Auto-calculated
            description: formData.description,
            negativeMarks: parseFloat(formData.negativeMarks),
            testType: formData.testType,
            isPublished: formData.isPublished
        };

        // Add type-specific fields
        if (formData.testType === 'current-affairs') {
            submitData.year = parseInt(formData.year);
            if (formData.month) submitData.month = formData.month;
        }

        if (formData.testType === 'subject-wise' && formData.subject) {
            submitData.subject = formData.subject;
        }

        if (formData.testType === 'exam-wise') {
            if (formData.exam) submitData.exam = formData.exam;
            if (formData.subExam) submitData.subExam = formData.subExam;
        }

        const result = await createContent('mock-tests', submitData);

        if (result) {
            setCreatedTest(result);
            setShowSuccessModal(true);
            setFormData({
                title: '',
                examName: '',
                difficulty: 'Medium',
                duration: 60,
                totalQuestions: 0,
                description: '',
                negativeMarks: 0,
                testType: defaultTestType,
                year: new Date().getFullYear(),
                month: '',
                subject: '',
                exam: '',
                subExam: '',
                isPublished: true
            });
        }
        setIsLoading(false);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setCreatedTest(null);
        if (onSuccess) onSuccess();
    };

    const handleAddQuestionsNow = () => {
        setShowSuccessModal(false);
        if (onAddQuestions && createdTest) {
            onAddQuestions(createdTest);
        }
    };

    const getFormTitle = () => {
        switch (defaultTestType) {
            case 'current-affairs': return 'Create J & K Current Affairs Test';
            case 'exam-wise': return 'Create Exam-Wise Test';
            case 'subject-wise': return 'Create Subject-Wise Test';
            case 'pyq': return 'Create PYQ Test';
            default: return 'Create New Mock Test';
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </span>
                    {getFormTitle()}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Affairs specific fields */}
                    {formData.testType === 'current-affairs' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                                <input
                                    type="number"
                                    name="year"
                                    className="modern-input w-full"
                                    required
                                    min="2020"
                                    max="2030"
                                    value={formData.year}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Month (Optional)</label>
                                <select
                                    name="month"
                                    className="modern-select w-full"
                                    value={formData.month}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Month</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Subject-wise specific fields */}
                    {formData.testType === 'subject-wise' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                            <select
                                name="subject"
                                className="modern-select w-full"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                            >
                                <option value="">Select Subject</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                                <option value="Politics">Politics</option>
                                <option value="General Knowledge">General Knowledge</option>
                                <option value="English">English</option>
                                <option value="Science">Science</option>
                            </select>
                        </div>
                    )}

                    {/* Exam-wise specific fields */}
                    {formData.testType === 'exam-wise' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam *</label>
                                <select
                                    name="exam"
                                    className="modern-select w-full"
                                    required
                                    value={formData.exam}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFormData(prev => ({ ...prev, subExam: '' }));
                                    }}
                                >
                                    <option value="">Select Exam</option>
                                    <option value="JKSSB">JKSSB</option>
                                    <option value="JKP">JKP</option>
                                    <option value="SSC">SSC</option>
                                    <option value="UPSC">UPSC</option>
                                </select>
                            </div>
                            {formData.exam === 'JKSSB' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">JKSSB Exam Type *</label>
                                    <select
                                        name="subExam"
                                        className="modern-select w-full"
                                        required
                                        value={formData.subExam}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Exam Type</option>
                                        <option value="SI">Sub-Inspector (SI)</option>
                                        <option value="Junior Assistant">Junior Assistant</option>
                                        <option value="Accounts Assistant">Accounts Assistant</option>
                                        <option value="Panchayat Secretary">Panchayat Secretary</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Common fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Category *</label>
                            <input
                                type="text"
                                name="examName"
                                className="modern-input w-full"
                                placeholder="e.g. JKSSB SI"
                                required
                                value={formData.examName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins) *</label>
                            <input
                                type="number"
                                name="duration"
                                className="modern-input w-full"
                                required
                                min="1"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                            <select
                                name="difficulty"
                                className="modern-select w-full"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks *</label>
                            <input
                                type="number"
                                name="negativeMarks"
                                className="modern-input w-full"
                                required
                                min="0"
                                step="0.01"
                                value={formData.negativeMarks}
                                onChange={handleChange}
                                placeholder="0.25"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            className="modern-input w-full"
                            rows="3"
                            placeholder="Instructions or details about the test..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility Status *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 flex-1">
                                    <input
                                        type="radio"
                                        name="isPublished"
                                        value="true"
                                        checked={formData.isPublished === true}
                                        onChange={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Publish Now</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 flex-1">
                                    <input
                                        type="radio"
                                        name="isPublished"
                                        value="false"
                                        checked={formData.isPublished === false}
                                        onChange={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Private</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Test...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Mock Test
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && createdTest && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm" onClick={handleCloseSuccessModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Mock Test Created!</h3>
                                <p className="text-gray-600 text-center mb-6">
                                    <strong>{createdTest.title}</strong> has been successfully created.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAddQuestionsNow}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        Add Questions Now
                                    </button>
                                    <button
                                        onClick={handleCloseSuccessModal}
                                        className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-base hover:bg-gray-50 transition-all"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MockTestForm;
