import React, { useState, useEffect, useContext } from 'react';
import MockTestForm from './MockTestForm'; // Reuse existing form logic if possible, or adapt
import AddQuestionForm from './AddQuestionForm'; // Reuse existing
import { useAuth } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import Loading from '../Loading';
import AddTestModal from '../AddTestModal'; // Import the modal we just updated

const PYQTestManager = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'add-questions'
    const [selectedTest, setSelectedTest] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Use modal for creation
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
                // Filter only PYQ tests
                setTests(data.filter(t => t.testType === 'pyq'));
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTest = async (newTest) => {
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTest)
            });

            if (response.ok) {
                fetchTests();
                setIsModalOpen(false);
            } else {
                const errData = await response.json();
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding mock test:', error);
            alert("Error adding mock test. Check console for details.");
        }
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">PYQ Tests Manager</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add PYQ Test
                </button>
            </div>

            <AddTestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleCreateTest}
                isPYQ={true}
            />

            {loading ? (
                <div className="text-center py-12"><Loading size="medium" /></div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">No PYQ tests found.</div>
                    ) : (
                        tests.map(test => (
                            <div key={test._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-800">{test.title}</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">Year: {test.year}</span>
                                        {test.month && (
                                            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full font-medium">{test.month}</span>
                                        )}
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{test.examName}</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{test.questions?.length || 0} Qs</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-1">{test.description}</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleManageQuestions(test)}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
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

export default PYQTestManager;
