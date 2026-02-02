import React, { useState, useEffect, useContext } from 'react';
import MockTestForm from './MockTestForm';
import AddQuestionForm from './AddQuestionForm';
import { useAuth } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import Loading from '../Loading';

const ExamWiseTestManager = () => {
    const [view, setView] = useState('list');
    const [selectedTest, setSelectedTest] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        if (view === 'list') {
            fetchTests();
        }
    }, [view]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only exam-wise tests
                const examWiseTests = data.filter(test => test.testType === 'exam-wise');
                setTests(examWiseTests);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        setView('list');
    };

    const handleManageQuestions = (test) => {
        setSelectedTest(test);
        setView('add-questions');
    };

    const handleDeleteTest = async (testId) => {
        if (!confirm('Are you sure you want to delete this test? All questions will be deleted.')) return;
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${testId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchTests();
            } else {
                alert("Failed to delete test");
            }
        } catch (error) {
            console.error("Error deleting test:", error);
        }
    };

    if (view === 'create') {
        return (
            <div>
                <button onClick={() => setView('list')} className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to List
                </button>
                <MockTestForm
                    onSuccess={handleCreateSuccess}
                    onAddQuestions={(test) => {
                        setSelectedTest(test);
                        setView('add-questions');
                    }}
                    defaultTestType="exam-wise"
                />
            </div>
        );
    }

    if (view === 'add-questions' && selectedTest) {
        return (
            <AddQuestionForm
                testId={selectedTest._id}
                testName={selectedTest.title}
                onBack={() => {
                    setSelectedTest(null);
                    setView('list');
                }}
            />
        );
    }

    // List View
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Exam-Wise Tests</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage mock tests organized by specific exams (JKSSB, JKP, SSC, etc.)</p>
                </div>
                <button
                    onClick={() => setView('create')}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Create New Test
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loading size="medium" /></div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">No Exam-Wise tests found. Create one to get started.</div>
                    ) : (
                        tests.map(test => (
                            <div key={test._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800">{test.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">Exam-Wise</span>
                                        {test.exam && <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">{test.exam}{test.subExam ? ` - ${test.subExam}` : ''}</span>}
                                        <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">{test.examName}</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{test.questions?.length || 0} Questions</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{test.difficulty}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-1">{test.description}</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleManageQuestions(test)}
                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-100 transition-colors"
                                    >
                                        Manage Questions
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTest(test._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Test"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamWiseTestManager;
