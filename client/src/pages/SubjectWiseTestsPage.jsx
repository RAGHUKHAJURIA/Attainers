import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import CategoryNavigator from '../components/CategoryNavigator';
import { useUser, useAuth } from '@clerk/clerk-react';
import CardSkeleton from '../components/CardSkeleton';

const SubjectWiseTestsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Dummy data for demonstration
    const dummyTests = [
        // Mathematics
        { id: 'math-1', title: 'Mathematics - Algebra Basics', examName: 'Mathematics', totalQuestions: 50, duration: 60, difficulty: 'Easy', testType: 'subject-wise', subject: 'Mathematics', description: 'Test your algebra fundamentals' },
        { id: 'math-2', title: 'Mathematics - Geometry Advanced', examName: 'Mathematics', totalQuestions: 60, duration: 75, difficulty: 'Hard', testType: 'subject-wise', subject: 'Mathematics', description: 'Advanced geometry problems' },
        { id: 'math-3', title: 'Mathematics - Trigonometry', examName: 'Mathematics', totalQuestions: 45, duration: 60, difficulty: 'Medium', testType: 'subject-wise', subject: 'Mathematics', description: 'Comprehensive trigonometry test' },
        { id: 'math-4', title: 'Mathematics - Calculus Fundamentals', examName: 'Mathematics', totalQuestions: 50, duration: 70, difficulty: 'Medium', testType: 'subject-wise', subject: 'Mathematics', description: 'Basic calculus concepts' },

        // History
        { id: 'hist-1', title: 'History - Ancient India', examName: 'History', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'subject-wise', subject: 'History', description: 'Ancient Indian history and civilizations' },
        { id: 'hist-2', title: 'History - Medieval Period', examName: 'History', totalQuestions: 45, duration: 55, difficulty: 'Medium', testType: 'subject-wise', subject: 'History', description: 'Medieval Indian history' },
        { id: 'hist-3', title: 'History - Modern India', examName: 'History', totalQuestions: 55, duration: 65, difficulty: 'Hard', testType: 'subject-wise', subject: 'History', description: 'Modern Indian history and freedom struggle' },
        { id: 'hist-4', title: 'History - World History', examName: 'History', totalQuestions: 60, duration: 70, difficulty: 'Hard', testType: 'subject-wise', subject: 'History', description: 'Major world historical events' },

        // Geography
        { id: 'geo-1', title: 'Geography - Physical Geography', examName: 'Geography', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'subject-wise', subject: 'Geography', description: 'Landforms, climate, and natural features' },
        { id: 'geo-2', title: 'Geography - Indian Geography', examName: 'Geography', totalQuestions: 45, duration: 55, difficulty: 'Easy', testType: 'subject-wise', subject: 'Geography', description: 'Geography of India' },
        { id: 'geo-3', title: 'Geography - World Geography', examName: 'Geography', totalQuestions: 55, duration: 65, difficulty: 'Medium', testType: 'subject-wise', subject: 'Geography', description: 'Countries, capitals, and continents' },
        { id: 'geo-4', title: 'Geography - Economic Geography', examName: 'Geography', totalQuestions: 50, duration: 60, difficulty: 'Hard', testType: 'subject-wise', subject: 'Geography', description: 'Resources and economic activities' },

        // Politics
        { id: 'pol-1', title: 'Politics - Indian Constitution', examName: 'Politics', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'subject-wise', subject: 'Politics', description: 'Constitutional provisions and amendments' },
        { id: 'pol-2', title: 'Politics - Political Theory', examName: 'Politics', totalQuestions: 45, duration: 55, difficulty: 'Hard', testType: 'subject-wise', subject: 'Politics', description: 'Political ideologies and theories' },
        { id: 'pol-3', title: 'Politics - Indian Polity', examName: 'Politics', totalQuestions: 55, duration: 65, difficulty: 'Medium', testType: 'subject-wise', subject: 'Politics', description: 'Governance and political system' },
        { id: 'pol-4', title: 'Politics - International Relations', examName: 'Politics', totalQuestions: 50, duration: 60, difficulty: 'Hard', testType: 'subject-wise', subject: 'Politics', description: 'Global politics and diplomacy' },

        // General Knowledge
        { id: 'gk-1', title: 'General Knowledge - Science & Technology', examName: 'General Knowledge', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'subject-wise', subject: 'General Knowledge', description: 'Latest developments in science and tech' },
        { id: 'gk-2', title: 'General Knowledge - Sports & Awards', examName: 'General Knowledge', totalQuestions: 40, duration: 50, difficulty: 'Easy', testType: 'subject-wise', subject: 'General Knowledge', description: 'Sports events and prestigious awards' },
        { id: 'gk-3', title: 'General Knowledge - Books & Authors', examName: 'General Knowledge', totalQuestions: 45, duration: 55, difficulty: 'Medium', testType: 'subject-wise', subject: 'General Knowledge', description: 'Famous books and their authors' },
        { id: 'gk-4', title: 'General Knowledge - Mixed Topics', examName: 'General Knowledge', totalQuestions: 60, duration: 70, difficulty: 'Hard', testType: 'subject-wise', subject: 'General Knowledge', description: 'Comprehensive GK test' },
    ];

    const subjects = [
        { id: 'Mathematics', name: 'Mathematics', icon: '📐', color: 'bg-blue-500', iconColor: 'text-white' },
        { id: 'History', name: 'History', icon: '📜', color: 'bg-amber-500', iconColor: 'text-white' },
        { id: 'Geography', name: 'Geography', icon: '🌍', color: 'bg-green-500', iconColor: 'text-white' },
        { id: 'Politics', name: 'Politics', icon: '⚖️', color: 'bg-purple-500', iconColor: 'text-white' },
        { id: 'General Knowledge', name: 'General Knowledge', icon: '💡', color: 'bg-orange-500', iconColor: 'text-white' },
    ];

    useEffect(() => {
        fetchSubjectWiseTests();
    }, []);

    const fetchSubjectWiseTests = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/mock-tests');
            if (response.ok) {
                const data = await response.json();
                const subjectTests = data.filter(test => test.testType === 'subject-wise');
                setTests([...dummyTests, ...subjectTests]);
            } else {
                setTests(dummyTests);
            }
        } catch (error) {
            console.error('Error fetching Subject-wise tests:', error);
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
            const testData = { ...newTest, testType: 'subject-wise' };

            const response = await fetch('https://attainers-272i.vercel.app/api/admin/mock-tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                fetchSubjectWiseTests();
            } else {
                console.error("Failed to add test. Status:", response.status);
                const errData = await response.json();
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding Subject-wise test:', error);
            alert("Error adding Subject-wise test. Check console for details.");
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

    const getTestCountForSubject = (subjectName) => {
        return tests.filter(test => test.subject === subjectName).length;
    };

    const getTestsForSubject = (subjectName) => {
        return tests.filter(test => test.subject === subjectName);
    };

    const renderSubjectSelection = () => {
        const subjectCategories = subjects.map(subject => ({
            id: subject.id,
            title: subject.name,
            description: `Practice ${subject.name.toLowerCase()} with comprehensive tests`,
            count: getTestCountForSubject(subject.id),
            colorClass: subject.color,
            icon: (
                <span className={`text-3xl ${subject.iconColor}`}>{subject.icon}</span>
            )
        }));

        return (
            <CategoryNavigator
                categories={subjectCategories}
                onCategoryClick={(category) => setSelectedSubject(category.id)}
                title="Subject-wise Mock Tests"
                description="Choose a subject to practice"
            />
        );
    };

    const renderTests = () => {
        const testsToShow = getTestsForSubject(selectedSubject);
        const subject = subjects.find(s => s.id === selectedSubject);

        return (
            <div className="animate-fadeIn">
                {/* Back Button and Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-3xl">{subject?.icon}</span>
                                {selectedSubject}
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
                        <div className={`w-16 h-16 ${subject?.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-3xl">{subject?.icon}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tests available yet</h3>
                        <p className="text-gray-500 mt-1">Check back soon for new {selectedSubject} tests!</p>
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
                            <span className="text-green-600 text-4xl">📚</span> Subject-wise Tests
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Master each subject with focused practice tests.
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
                        {!selectedSubject && renderSubjectSelection()}
                        {selectedSubject && renderTests()}
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

export default SubjectWiseTestsPage;
