import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import CategoryNavigator from '../components/CategoryNavigator';
import { useUser, useAuth } from '@clerk/clerk-react';
import CardSkeleton from '../components/CardSkeleton';
import { AppContext } from '../context/AppContext';
import AddExamModal from '../components/AddExamModal';

const ExamWiseTestsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { backendUrl } = useContext(AppContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState(null);

    const colorPalette = [
        { color: 'bg-red-500', icon: '🎯' },
        { color: 'bg-blue-500', icon: '📋' },
        { color: 'bg-purple-500', icon: '🎓' },
        { color: 'bg-green-500', icon: '✅' },
        { color: 'bg-amber-500', icon: '📝' },
        { color: 'bg-indigo-500', icon: '🚀' },
    ];

    useEffect(() => {
        if (isLoaded) {
            const adminStatus = user?.publicMetadata?.role === 'admin';
            setIsAdmin(adminStatus);
            fetchExamWiseTests(adminStatus);
        }
    }, [isLoaded, user, backendUrl]);

    const fetchExamWiseTests = async (overrideAdminStatus) => {
        const shouldUseAdmin = overrideAdminStatus !== undefined ? overrideAdminStatus : isAdmin;
        try {
            const endpoint = shouldUseAdmin
                ? `${backendUrl}/api/admin/mock-tests`
                : `${backendUrl}/api/public/mock-tests`;

            const options = {};
            if (shouldUseAdmin) {
                const token = await getToken();
                options.headers = {
                    'Authorization': `Bearer ${token}`
                };


            }

            const response = await fetch(endpoint, options);
            if (response.ok) {
                const data = await response.json();
                const examTests = data.filter(test => test.testType === 'exam-wise');
                setTests(examTests);
            } else {
                setTests([]);
            }
        } catch (error) {
            console.error('Error fetching Exam-wise tests:', error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (id, newStatus) => {
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isPublished: newStatus })
            });

            if (response.ok) {
                setTests(tests.map(test =>
                    (test.id || test._id) === id ? { ...test, isPublished: newStatus } : test
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        }
    };



    const getExams = () => {
        // Find unique exams from placeholders
        const examPlaceholders = tests.filter(test => test.isPlaceholder && test.examName);
        return examPlaceholders.map((ph, index) => {
            const style = colorPalette[index % colorPalette.length];
            return {
                id: ph.examName,
                name: ph.examName,
                icon: style.icon,
                color: style.color,
                placeholderId: ph._id
            };
        });
    };

    const handleAddExam = async (examData) => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: examData.title,
                    examName: examData.examName, // Category Name
                    totalQuestions: 0,
                    duration: 0,
                    difficulty: 'Easy',
                    testType: 'exam-wise',
                    description: `Category for ${examData.examName}`,
                    isPlaceholder: true,
                    isPublished: true,
                    year: new Date().getFullYear()
                })
            });

            if (response.ok) {
                await fetchExamWiseTests();
                setIsExamModalOpen(false);
                alert(`Exam ${examData.examName} added successfully!`);
            } else {
                alert('Failed to add exam');
            }
        } catch (error) {
            console.error("Error adding exam:", error);
            alert("Error adding exam");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (category) => {
        const examName = category.id;
        const testsToDelete = tests.filter(test => test.examName === examName);
        const count = testsToDelete.length;

        if (!window.confirm(`Delete ${examName}? This will PERMANENTLY delete the exam category and ALL ${count} tests inside it.`)) {
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();
            const deletePromises = testsToDelete.map(test =>
                fetch(`${backendUrl}/api/admin/mock-tests/${test._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            await Promise.all(deletePromises);
            await fetchExamWiseTests();
            alert(`Deleted ${examName} and all its tests.`);
        } catch (error) {
            console.error("Error deleting exam:", error);
            alert("Failed to delete exam");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTest = async (newTest) => {
        try {
            setLoading(true);
            const token = await getToken();
            const testData = {
                ...newTest,
                testType: 'exam-wise',
                examName: selectedExam // Ensure it links to current exam category
            };

            const response = await fetch(`${backendUrl}/api/admin/mock-tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                await fetchExamWiseTests();
                setIsTestModalOpen(false);
                alert("Test added successfully!");
            } else {
                const errData = await response.json();
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding Exam-wise test:', error);
            alert("Error adding Exam-wise test.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this test?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setTests(tests.filter(test => (test.id || test._id) !== id));
            } else {
                alert("Failed to delete test");
            }
        } catch (error) {
            console.error("Error deleting test:", error);
        }
    };

    const getTestCountForExam = (examName) => {
        return tests.filter(test => test.examName === examName && !test.isPlaceholder).length;
    };

    const getTestsForExam = (examName) => {
        return tests.filter(test => test.examName === examName && !test.isPlaceholder);
    };

    const renderExamSelection = () => {
        const examList = getExams();
        const examCategories = examList.map(exam => ({
            id: exam.id,
            title: exam.name,
            description: `Practice tests for ${exam.name} exams`,
            count: getTestCountForExam(exam.id),
            colorClass: exam.color,
            icon: (
                <span className="text-3xl text-white">{exam.icon}</span>
            )
        }));

        return (
            <CategoryNavigator
                categories={examCategories}
                onCategoryClick={(category) => setSelectedExam(category.id)}
                title="Exam-wise Mock Tests"
                description="Choose an exam category to practice"
                onDelete={isAdmin ? handleDeleteExam : null}
            />
        );
    };

    const renderTests = () => {
        const testsToShow = getTestsForExam(selectedExam);
        const examList = getExams();
        const exam = examList.find(e => e.id === selectedExam) || { icon: '🎯' };

        return (
            <div className="animate-fadeIn">
                {/* Back Button and Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => setSelectedExam(null)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-3xl">{exam.icon}</span>
                                {selectedExam}
                            </h2>
                            <p className="text-gray-600 mt-1">{testsToShow.length} tests available</p>
                        </div>
                    </div>
                </div>

                {/* Tests Grid */}
                {testsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testsToShow.map((test) => (
                            <TestCard
                                key={test.id || test._id}
                                {...test}
                                isAdmin={isAdmin}
                                onDelete={handleDeleteTest}
                                onTogglePublish={handleTogglePublish}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-16 h-16 ${exam.color || 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-3xl">{exam.icon}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tests available yet</h3>
                        <p className="text-gray-500 mt-1">Check back soon for new {selectedExam} tests!</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-red-600 text-4xl">🎯</span> Exam-wise Tests
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Targeted practice for specific competitive exams.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {isAdmin && (
                            <button
                                onClick={() => selectedExam ? setIsTestModalOpen(true) : setIsExamModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {selectedExam ? 'Add Mock Test' : 'Add Exam'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {!selectedExam && renderExamSelection()}
                        {selectedExam && renderTests()}
                    </>
                )}
            </main>

            <Footer />

            <AddExamModal
                isOpen={isExamModalOpen}
                onClose={() => setIsExamModalOpen(false)}
                onAdd={handleAddExam}
            />

            <AddTestModal
                isOpen={isTestModalOpen}
                onClose={() => setIsTestModalOpen(false)}
                onAdd={handleAddTest}
                isExamWise={true}
                examName={selectedExam}
            />
        </div>
    );
};

export default ExamWiseTestsPage;
