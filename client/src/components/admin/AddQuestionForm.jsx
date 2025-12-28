import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';

const AddQuestionForm = ({ testId, testName, onBack }) => {
    const { getToken } = useAuth();
    const { backendUrl } = useContext(AppContext);

    // Form State
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    const [explanation, setExplanation] = useState('');
    const [marks, setMarks] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Existing Questions State (for list view)
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, [testId]);

    const fetchQuestions = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${testId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setQuestions(data.questions || []);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectOptionChange = (index) => {
        const newOptions = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
        setOptions(newOptions);
    };

    const handleAddQuestion = async (e, shouldClose = false) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        try {
            const token = await getToken();
            const questionData = {
                questionText: questionText.trim(),
                options: options.map(o => ({ ...o, text: o.text.trim() })),
                explanation: explanation.trim(),
                marks: parseFloat(marks) || 1
            };
            const payload = { questions: [questionData] };

            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${testId}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Reset Form
                setQuestionText('');
                setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
                setExplanation('');

                // Refresh list
                fetchQuestions();

                if (shouldClose) {
                    onBack();
                }
            } else {
                alert('Failed to add question');
            }
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Error adding question');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!confirm('Currently, effective deletion requires re-saving the entire question set which is complex. This button is a placeholder for future specific delete endpoint.')) return;
        // TODO: Implement specific delete endpoint in backend if needed, or filter and update entire test.
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Tests
                </button>
                <h2 className="text-xl font-bold text-gray-800">Adding Questions to: {testName}</h2>
            </div>

            {/* Existing Questions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">Existing Questions ({questions.length})</h3>
                    <button onClick={fetchQuestions} className="text-blue-600 hover:text-blue-800 text-sm">Refresh</button>
                </div>
                {loadingQuestions ? (
                    <div className="text-center py-4">Loading questions...</div>
                ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {questions.length === 0 ? <p className="text-gray-400 text-sm italic">No questions yet.</p> : (
                            questions.map((q, idx) => (
                                <div key={q._id || idx} className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100 flex justify-between group">
                                    <div className="truncate pr-4 flex-1">
                                        <span className="font-bold text-gray-500 mr-2">Q{idx + 1}.</span>
                                        {q.questionText}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap">{q.marks} Marks</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Add New Question Form */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    New Question
                </h3>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <textarea
                            required
                            className="modern-input w-full"
                            rows="3"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Type your question here..."
                        ></textarea>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={option.isCorrect}
                                    onChange={() => handleCorrectOptionChange(index)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    required
                                    className={`modern-input py-2 flex-grow ${option.isCorrect ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 ml-7">Select the radio button for the correct answer.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                            <input
                                type="number"
                                required
                                min="0.5"
                                step="0.5"
                                className="modern-input"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                        <textarea
                            className="modern-input w-full"
                            rows="2"
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            placeholder="Explain the correct answer..."
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={(e) => handleAddQuestion(e, false)}
                            className="flex-1 bg-white border-2 border-indigo-600 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save & Add Another'}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={(e) => handleAddQuestion(e, true)}
                            className="flex-1 btn-primary py-3 rounded-xl shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save & Finish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuestionForm;
