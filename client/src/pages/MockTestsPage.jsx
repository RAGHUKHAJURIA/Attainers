import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import SectionCard from '../components/SectionCard';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import CardSkeleton from '../components/CardSkeleton';


const MockTestsPage = () => {
    const { backendUrl } = useContext(AppContext);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCategories, setShowCategories] = useState(true);



    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            const adminStatus = user?.publicMetadata?.role === 'admin';
            setIsAdmin(adminStatus);
            fetchTests(adminStatus);
        }
    }, [isLoaded, user]);

    const fetchTests = async (overrideAdminStatus) => {
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
                setTests(data);
            }
        } catch (error) {
            console.error('Error fetching mock tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTest = async (newTest) => {
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

                fetchTests(); // Refresh list
            } else {
                console.error("Failed to add test. Status:", response.status);
                const errData = await response.json();
                console.error("Error details:", errData);
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding mock test:', error);
            alert("Error adding mock test. Check console for details.");
        }
    };

    const handleDelete = async (id) => {
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
        }
    };

    const filteredTests = tests.filter(test =>
        (test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.examName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        test.testType === 'mock-test' // Only show mock-test type, not current-affairs, subject-wise, or exam-wise
    );

    // Render category cards
    const renderCategoryCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">


            <SectionCard
                title="Subject Wise"
                description="Practice subject-specific tests for Math, History, Geography, Politics, and more."
                icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                }
                colorClass="bg-green-500"
                onClick={() => navigate('/mock-tests/subject-wise')}
            />

            <SectionCard
                title="Exam Wise"
                description="Targeted preparation for JKSSB, JKP, SSC, and other competitive exams."
                icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                }
                colorClass="bg-red-500"
                onClick={() => navigate('/mock-tests/exam-wise')}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Mock Tests
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Practice with exam-specific mock tests to boost your preparation.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tests..."
                                className="modern-input !pl-14"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Card
                            </button>
                        )}
                    </div>
                </div>

                {/* Toggle between categories and all tests */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${showCategories
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        onClick={() => setShowCategories(true)}
                    >
                        Categories
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!showCategories
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        onClick={() => setShowCategories(false)}
                    >
                        All Tests
                    </button>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : showCategories ? (
                    renderCategoryCards()
                ) : filteredTests.length > 0 ? (
                    <div className="h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                            {filteredTests.map((test) => (
                                <TestCard
                                    key={test.id || test._id}
                                    {...test}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
                                    onTogglePublish={handleTogglePublish}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tests found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
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

export default MockTestsPage;
