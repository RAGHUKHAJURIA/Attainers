import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import { useUser, useAuth } from '@clerk/clerk-react';

const MockTestsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');



    const [tests, setTests] = useState([]);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await fetch('https://attainers.vercel.app/api/public/mock-tests');
            if (response.ok) {
                const data = await response.json();
                setTests(data);
            }
        } catch (error) {
            console.error('Error fetching mock tests:', error);
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


            const response = await fetch('https://attainers.vercel.app/api/admin/mock-tests', {
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
            const response = await fetch(`https://attainers.vercel.app/api/admin/mock-tests/${id}`, {
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

    const filteredTests = tests.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.examName.toLowerCase().includes(searchTerm.toLowerCase())
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

                {/* Filters - can be expanded later */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['All', 'JKSSB SI', 'JKSSB Junior Assistant', 'SSC CGL'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${searchTerm === '' && filter === 'All' ? 'bg-blue-600 text-white' :
                                filter !== 'All' && searchTerm.includes(filter) ? 'bg-blue-600 text-white' :
                                    'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSearchTerm(filter === 'All' ? '' : filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Scrollable Grid Container */}
                {filteredTests.length > 0 ? (
                    <div className="h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                            {filteredTests.map((test) => (
                                <TestCard
                                    key={test.id || test._id}
                                    {...test}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
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
