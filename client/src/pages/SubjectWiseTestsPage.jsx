import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import CategoryNavigator from '../components/CategoryNavigator';
import { useUser, useAuth } from '@clerk/clerk-react';
import CardSkeleton from '../components/CardSkeleton';
import { AppContext } from '../context/AppContext';
import AddSubjectModal from '../components/AddSubjectModal';

const SubjectWiseTestsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { backendUrl } = useContext(AppContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Dynamic colors for subjects
    const colorPalette = [
        { color: 'bg-blue-500', icon: '📐' },
        { color: 'bg-amber-500', icon: '📜' },
        { color: 'bg-green-500', icon: '🌍' },
        { color: 'bg-purple-500', icon: '⚖️' },
        { color: 'bg-orange-500', icon: '💡' },
        { color: 'bg-red-500', icon: '🔬' },
        { color: 'bg-indigo-500', icon: '💻' },
        { color: 'bg-teal-500', icon: '🌱' },
    ];

    useEffect(() => {
        if (isLoaded) {
            const adminStatus = user?.publicMetadata?.role === 'admin';
            setIsAdmin(adminStatus);
            fetchSubjectWiseTests(adminStatus);
        }
    }, [isLoaded, user, backendUrl]);

    const fetchSubjectWiseTests = async (overrideAdminStatus) => {
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
                const subjectTests = data.filter(test => test.testType === 'subject-wise');
                setTests(subjectTests);
            } else {
                setTests([]);
            }
        } catch (error) {
            console.error('Error fetching Subject-wise tests:', error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };



    // Derived Subjects from Placeholders
    const getSubjects = () => {
        // Find all unique subjects from tests that are placeholders
        const subjectPlaceholders = tests.filter(test => test.isPlaceholder && test.subject);
        return subjectPlaceholders.map((ph, index) => {
            // Assign a consistent color/icon based on index or hash
            const style = colorPalette[index % colorPalette.length];
            return {
                id: ph.subject,
                name: ph.subject,
                icon: style.icon,
                color: style.color,
                placeholderId: ph._id, // Keep ID for deletion
                isPublished: ph.isPublished
            };
        });
    };

    const handleToggleSubjectPublish = async (category) => {
        const placeholderId = category.placeholderId;
        const newStatus = !category.isPublished;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/mock-tests/${placeholderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isPublished: newStatus })
            });

            if (response.ok) {
                // Update local state by mapping over tests and finding the placeholder
                setTests(tests.map(test =>
                    test._id === placeholderId ? { ...test, isPublished: newStatus } : test
                ));
            } else {
                alert("Failed to update subject status");
            }
        } catch (error) {
            console.error("Error updating subject status:", error);
            alert("Error updating subject status");
        }
    };

    const handleAddSubject = async (subjectData) => {
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
                    title: subjectData.title,
                    examName: 'Subject Wise',
                    totalQuestions: 0,
                    duration: 0,
                    difficulty: 'Easy',
                    testType: 'subject-wise',
                    subject: subjectData.subject,
                    description: `Category for ${subjectData.subject}`,
                    isPlaceholder: true,
                    isPublished: true,
                    year: new Date().getFullYear() // Dummy year to satisfy some validations if any strictness remains
                })
            });

            if (response.ok) {
                await fetchSubjectWiseTests();
                setIsSubjectModalOpen(false);
                alert(`Subject ${subjectData.subject} added successfully!`);
            } else {
                alert('Failed to add subject');
            }
        } catch (error) {
            console.error("Error adding subject:", error);
            alert("Error adding subject");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubject = async (category) => {
        const subjectName = category.id;
        // Need to delete the placeholder AND all tests in this subject
        const testsToDelete = tests.filter(test => test.subject === subjectName);
        const count = testsToDelete.length;

        if (!window.confirm(`Delete ${subjectName}? This will PERMANENTLY delete the subject and ALL ${count} tests inside it.`)) {
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();

            // Parallel delete
            const deletePromises = testsToDelete.map(test =>
                fetch(`${backendUrl}/api/admin/mock-tests/${test._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );

            await Promise.all(deletePromises);
            await fetchSubjectWiseTests();
            alert(`Deleted ${subjectName} and all its tests.`);
        } catch (error) {
            console.error("Error deleting subject:", error);
            alert("Failed to delete subject");
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
                testType: 'subject-wise',
                subject: selectedSubject // Ensure it links to current subject
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
                await fetchSubjectWiseTests();
                setIsTestModalOpen(false);
                alert("Test added successfully!");
            } else {
                const errData = await response.json();
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding Subject-wise test:', error);
            alert("Error adding Subject-wise test.");
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

    const getTestCountForSubject = (subjectName) => {
        return tests.filter(test => test.subject === subjectName && !test.isPlaceholder).length;
    };

    const getTestsForSubject = (subjectName) => {
        return tests.filter(test => test.subject === subjectName && !test.isPlaceholder && !test.title.startsWith('_'));
    };

    const renderSubjectSelection = () => {
        const subjectList = getSubjects();
        const subjectCategories = subjectList.map(subject => ({
            id: subject.id,
            title: subject.name,
            description: `Practice ${subject.name.toLowerCase()} with comprehensive tests`,
            count: getTestCountForSubject(subject.id),
            colorClass: subject.color,
            placeholderId: subject.placeholderId,
            isPublished: subject.isPublished,
            icon: (
                <span className="text-3xl text-white">{subject.icon}</span>
            )
        }));

        return (
            <CategoryNavigator
                categories={subjectCategories}
                onCategoryClick={(category) => setSelectedSubject(category.id)}
                title="Subject-wise Mock Tests"
                description="Choose a subject to practice"
                onDelete={isAdmin ? handleDeleteSubject : null}
                onTogglePublish={isAdmin ? handleToggleSubjectPublish : null}
            />
        );
    };

    const renderTests = () => {
        const testsToShow = getTestsForSubject(selectedSubject);
        const subjectList = getSubjects();
        const subject = subjectList.find(s => s.id === selectedSubject) || { icon: '📚' };

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
                                <span className="text-3xl">{subject.icon}</span>
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
                                onDelete={handleDeleteTest}
                                onTogglePublish={handleTogglePublish}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-16 h-16 ${subject?.color || 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
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
                                onClick={() => selectedSubject ? setIsTestModalOpen(true) : setIsSubjectModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {selectedSubject ? 'Add Mock Test' : 'Add Subject'}
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

            <AddSubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onAdd={handleAddSubject}
            />

            <AddTestModal
                isOpen={isTestModalOpen}
                onClose={() => setIsTestModalOpen(false)}
                onAdd={handleAddTest}
                isSubjectWise={true}
                subject={selectedSubject}
            />
        </div>
    );
};

export default SubjectWiseTestsPage;
