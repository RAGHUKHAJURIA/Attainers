import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import CategoryNavigator from '../components/CategoryNavigator';
import { useUser, useAuth } from '@clerk/clerk-react';
import CardSkeleton from '../components/CardSkeleton';

const ExamWiseTestsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedSubExam, setSelectedSubExam] = useState(null);

    // Dummy data for demonstration
    const dummyTests = [
        // JKSSB SI
        { id: 'jkssb-si-1', title: 'JKSSB SI Full Mock Test 1', examName: 'JKSSB SI', totalQuestions: 100, duration: 120, difficulty: 'Hard', testType: 'exam-wise', exam: 'JKSSB', subExam: 'SI', description: 'Complete mock test for JKSSB SI exam' },
        { id: 'jkssb-si-2', title: 'JKSSB SI Reasoning Test', examName: 'JKSSB SI', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'SI', description: 'Reasoning section practice' },
        { id: 'jkssb-si-3', title: 'JKSSB SI General Knowledge', examName: 'JKSSB SI', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'SI', description: 'GK and current affairs' },

        // JKSSB Junior Assistant
        { id: 'jkssb-ja-1', title: 'JKSSB Junior Assistant Mock Test 1', examName: 'JKSSB Junior Assistant', totalQuestions: 100, duration: 120, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Junior Assistant', description: 'Full-length mock test' },
        { id: 'jkssb-ja-2', title: 'JKSSB JA Computer Knowledge', examName: 'JKSSB Junior Assistant', totalQuestions: 40, duration: 50, difficulty: 'Easy', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Junior Assistant', description: 'Computer awareness test' },
        { id: 'jkssb-ja-3', title: 'JKSSB JA English Language', examName: 'JKSSB Junior Assistant', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Junior Assistant', description: 'English proficiency test' },

        // JKSSB Accounts Assistant
        { id: 'jkssb-aa-1', title: 'JKSSB Accounts Assistant Mock 1', examName: 'JKSSB Accounts Assistant', totalQuestions: 100, duration: 120, difficulty: 'Hard', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Accounts Assistant', description: 'Complete mock test' },
        { id: 'jkssb-aa-2', title: 'JKSSB AA Accounting Basics', examName: 'JKSSB Accounts Assistant', totalQuestions: 60, duration: 75, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Accounts Assistant', description: 'Accounting fundamentals' },

        // JKSSB Panchayat Secretary
        { id: 'jkssb-ps-1', title: 'JKSSB Panchayat Secretary Mock 1', examName: 'JKSSB Panchayat Secretary', totalQuestions: 100, duration: 120, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Panchayat Secretary', description: 'Full mock test' },
        { id: 'jkssb-ps-2', title: 'JKSSB PS Rural Development', examName: 'JKSSB Panchayat Secretary', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKSSB', subExam: 'Panchayat Secretary', description: 'Rural development topics' },

        // JKP
        { id: 'jkp-1', title: 'JKP Constable Full Mock Test 1', examName: 'JKP Constable', totalQuestions: 100, duration: 120, difficulty: 'Hard', testType: 'exam-wise', exam: 'JKP', description: 'Complete JKP constable exam' },
        { id: 'jkp-2', title: 'JKP Physical Efficiency Test Prep', examName: 'JKP', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKP', description: 'PET preparation guide' },
        { id: 'jkp-3', title: 'JKP General Knowledge Test', examName: 'JKP', totalQuestions: 60, duration: 70, difficulty: 'Medium', testType: 'exam-wise', exam: 'JKP', description: 'GK for JKP exam' },
        { id: 'jkp-4', title: 'JKP Reasoning & Aptitude', examName: 'JKP', totalQuestions: 50, duration: 60, difficulty: 'Hard', testType: 'exam-wise', exam: 'JKP', description: 'Logical reasoning test' },

        // SSC
        { id: 'ssc-1', title: 'SSC CGL Tier 1 Mock Test', examName: 'SSC CGL', totalQuestions: 100, duration: 60, difficulty: 'Hard', testType: 'exam-wise', exam: 'SSC', description: 'SSC CGL Tier 1 practice' },
        { id: 'ssc-2', title: 'SSC CHSL Mock Test', examName: 'SSC CHSL', totalQuestions: 100, duration: 60, difficulty: 'Medium', testType: 'exam-wise', exam: 'SSC', description: 'SSC CHSL full test' },
        { id: 'ssc-3', title: 'SSC Quantitative Aptitude', examName: 'SSC', totalQuestions: 50, duration: 50, difficulty: 'Hard', testType: 'exam-wise', exam: 'SSC', description: 'Quant section practice' },
        { id: 'ssc-4', title: 'SSC English Language', examName: 'SSC', totalQuestions: 50, duration: 50, difficulty: 'Medium', testType: 'exam-wise', exam: 'SSC', description: 'English comprehension' },
    ];

    const exams = [
        {
            id: 'JKSSB',
            name: 'JKSSB',
            icon: '📋',
            color: 'bg-blue-500',
            iconColor: 'text-white',
            hasSubExams: true,
            subExams: [
                { id: 'SI', name: 'Sub-Inspector (SI)', icon: '👮', color: 'bg-indigo-500', iconColor: 'text-white' },
                { id: 'Junior Assistant', name: 'Junior Assistant', icon: '💼', color: 'bg-cyan-500', iconColor: 'text-white' },
                { id: 'Accounts Assistant', name: 'Accounts Assistant', icon: '💰', color: 'bg-teal-500', iconColor: 'text-white' },
                { id: 'Panchayat Secretary', name: 'Panchayat Secretary', icon: '🏛️', color: 'bg-sky-500', iconColor: 'text-white' },
            ]
        },
        { id: 'JKP', name: 'JKP', icon: '🚔', color: 'bg-red-500', iconColor: 'text-white', hasSubExams: false },
        { id: 'SSC', name: 'SSC', icon: '🎓', color: 'bg-purple-500', iconColor: 'text-white', hasSubExams: false },
    ];

    useEffect(() => {
        fetchExamWiseTests();
    }, []);

    const fetchExamWiseTests = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/mock-tests');
            if (response.ok) {
                const data = await response.json();
                const examTests = data.filter(test => test.testType === 'exam-wise');
                setTests([...dummyTests, ...examTests]);
            } else {
                setTests(dummyTests);
            }
        } catch (error) {
            console.error('Error fetching Exam-wise tests:', error);
            setTests(dummyTests);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const handleAddTest = async (newTest) => {
        try {
            const token = await getToken();
            const testData = { ...newTest, testType: 'exam-wise' };

            const response = await fetch('https://attainers-272i.vercel.app/api/admin/mock-tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                fetchExamWiseTests();
            } else {
                console.error("Failed to add test. Status:", response.status);
                const errData = await response.json();
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding Exam-wise test:', error);
            alert("Error adding Exam-wise test. Check console for details.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this test?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`https://attainers-272i.vercel.app/api/admin/mock-tests/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        return tests.filter(test => test.exam === examName).length;
    };

    const getTestCountForSubExam = (examName, subExamName) => {
        return tests.filter(test => test.exam === examName && test.subExam === subExamName).length;
    };

    const getTestsForExam = (examName, subExamName = null) => {
        if (subExamName) {
            return tests.filter(test => test.exam === examName && test.subExam === subExamName);
        }
        return tests.filter(test => test.exam === examName && !test.subExam);
    };

    const renderExamSelection = () => {
        const examCategories = exams.map(exam => ({
            id: exam.id,
            title: exam.name,
            description: `Practice tests for ${exam.name} exams`,
            count: getTestCountForExam(exam.id),
            colorClass: exam.color,
            icon: (
                <span className={`text-3xl ${exam.iconColor}`}>{exam.icon}</span>
            )
        }));

        return (
            <CategoryNavigator
                categories={examCategories}
                onCategoryClick={(category) => setSelectedExam(category.id)}
                title="Exam-wise Mock Tests"
                description="Choose an exam category to practice"
            />
        );
    };

    const renderSubExamSelection = () => {
        const exam = exams.find(e => e.id === selectedExam);

        if (!exam.hasSubExams) {
            // If no sub-exams, directly show tests
            return renderTests();
        }

        const subExamCategories = exam.subExams.map(subExam => ({
            id: subExam.id,
            title: subExam.name,
            description: `${selectedExam} ${subExam.name} practice tests`,
            count: getTestCountForSubExam(selectedExam, subExam.id),
            colorClass: subExam.color,
            icon: (
                <span className={`text-3xl ${subExam.iconColor}`}>{subExam.icon}</span>
            )
        }));

        return (
            <CategoryNavigator
                categories={subExamCategories}
                onCategoryClick={(category) => setSelectedSubExam(category.id)}
                title={`${selectedExam} Exams`}
                description="Select a specific exam type"
                showBackButton={true}
                onBack={() => setSelectedExam(null)}
            />
        );
    };

    const renderTests = () => {
        const exam = exams.find(e => e.id === selectedExam);
        const testsToShow = getTestsForExam(selectedExam, selectedSubExam);

        let title = selectedExam;
        let icon = exam?.icon;

        if (selectedSubExam) {
            const subExam = exam?.subExams?.find(se => se.id === selectedSubExam);
            title = `${selectedExam} ${selectedSubExam}`;
            icon = subExam?.icon || icon;
        }

        return (
            <div className="animate-fadeIn">
                {/* Back Button and Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => selectedSubExam ? setSelectedSubExam(null) : setSelectedExam(null)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-3xl">{icon}</span>
                                {title}
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
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-16 h-16 ${exam?.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-3xl">{icon}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tests available yet</h3>
                        <p className="text-gray-500 mt-1">Check back soon for new {title} tests!</p>
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
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Test
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
                        {selectedExam && !selectedSubExam && renderSubExamSelection()}
                        {selectedExam && selectedSubExam && renderTests()}
                    </>
                )}
            </main>

            <Footer />

            <AddTestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddTest}
            />
        </div>
    );
};

export default ExamWiseTestsPage;
