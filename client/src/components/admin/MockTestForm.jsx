import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const MockTestForm = ({ onSuccess }) => {
    const { createContent } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        examName: '',
        difficulty: 'Medium',
        duration: 60,
        totalQuestions: 0,
        description: '',
        negativeMarks: 0
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

        const result = await createContent('mock-tests', formData);

        if (result) {
            setFormData({
                title: '',
                examName: '',
                difficulty: 'Medium',
                duration: 60,
                totalQuestions: 0,
                description: '',
                negativeMarks: 0
            });
            if (onSuccess) onSuccess();
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </span>
                Create New Mock Test
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                        <input
                            type="text"
                            name="examName"
                            className="modern-input w-full"
                            placeholder="e.g. JEE Mains 2024"
                            required
                            value={formData.examName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                        <input
                            type="text"
                            name="title"
                            className="modern-input w-full"
                            placeholder="e.g. Full Syllabus Mock 1"
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions (Estimate)</label>
                        <input
                            type="number"
                            name="totalQuestions"
                            className="modern-input w-full"
                            required
                            min="0"
                            value={formData.totalQuestions}
                            onChange={handleChange}
                            placeholder="Actual count updates as you add qs"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks</label>
                        <input
                            type="number"
                            name="negativeMarks"
                            className="modern-input w-full"
                            required
                            min="0"
                            step="0.01"
                            value={formData.negativeMarks}
                            onChange={handleChange}
                            placeholder="e.g. 1 or 0.25"
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
    );
};

export default MockTestForm;
