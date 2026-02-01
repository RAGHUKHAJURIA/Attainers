import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import AddTestModal from '../components/AddTestModal';
import CategoryNavigator from '../components/CategoryNavigator';
import { useUser, useAuth } from '@clerk/clerk-react';
import CardSkeleton from '../components/CardSkeleton';

const CurrentAffairsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Dummy data for demonstration
    const dummyTests = [
        // 2025 Tests
        { id: 'ca-2025-jan-1', title: 'Current Affairs January 2025 - Week 1', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'January', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2025-jan-2', title: 'Current Affairs January 2025 - Week 2', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'January', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2025-feb-1', title: 'Current Affairs February 2025 - Week 1', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'February', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2025-feb-2', title: 'Current Affairs February 2025 - Week 2', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'February', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2025-mar-1', title: 'Current Affairs March 2025 - Week 1', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'March', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2025-mar-2', title: 'Current Affairs March 2025 - Week 2', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2025, month: 'March', description: 'Weekly current affairs test covering major events' },

        // 2026 Tests
        { id: 'ca-2026-jan-1', title: 'Current Affairs January 2026 - Week 1', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2026, month: 'January', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2026-jan-2', title: 'Current Affairs January 2026 - Week 2', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2026, month: 'January', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2026-jan-3', title: 'Current Affairs January 2026 - Week 3', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2026, month: 'January', description: 'Weekly current affairs test covering major events' },
        { id: 'ca-2026-feb-1', title: 'Current Affairs February 2026 - Week 1', examName: 'Current Affairs', totalQuestions: 50, duration: 60, difficulty: 'Medium', testType: 'current-affairs', year: 2026, month: 'February', description: 'Weekly current affairs test covering major events' },
    ];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        fetchCurrentAffairsTests();
    }, []);

    const fetchCurrentAffairsTests = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/mock-tests');
            if (response.ok) {
                const data = await response.json();
                const currentAffairsTests = data.filter(test => test.testType === 'current-affairs');
                // Merge with dummy data
                setTests([...dummyTests, ...currentAffairsTests]);
            } else {
                // Use only dummy data if API fails
                setTests(dummyTests);
            }
        } catch (error) {
            console.error('Error fetching Current Affairs tests:', error);
            // Use dummy data as fallback
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
            const testData = { ...newTest, testType: 'current-affairs' };

            const response = await fetch('https://attainers-272i.vercel.app/api/admin/mock-tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            if (response.ok) {
                fetchCurrentAffairsTests();
            } else {
                console.error("Failed to add test. Status:", response.status);
                const errData = await response.json();
                console.error("Error details:", errData);
                alert(`Failed to add test: ${errData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding Current Affairs test:', error);
            alert("Error adding Current Affairs test. Check console for details.");
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

    // Get unique years from tests
    const getYears = () => {
        const years = [...new Set(tests.map(test => test.year).filter(Boolean))];
        return years.sort((a, b) => b - a); // Sort descending
    };

    // Get months for selected year
    const getMonthsForYear = (year) => {
        const testsInYear = tests.filter(test => test.year === year);
        const monthsWithTests = [...new Set(testsInYear.map(test => test.month).filter(Boolean))];
        return months.filter(month => monthsWithTests.includes(month));
    };

    // Get tests for selected month and year
    const getTestsForMonth = (year, month) => {
        return tests.filter(test => test.year === year && test.month === month);
    };

    // Get count of tests for a year
    const getTestCountForYear = (year) => {
        return tests.filter(test => test.year === year).length;
    };

    // Get count of tests for a month
    const getTestCountForMonth = (year, month) => {
        return tests.filter(test => test.year === year && test.month === month).length;
    };

    const filteredTests = tests.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.examName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Breadcrumbs
    const getBreadcrumbs = () => {
        const crumbs = [
            { label: 'Current Affairs', onClick: () => { setSelectedYear(null); setSelectedMonth(null); } }
        ];

        if (selectedYear) {
            crumbs.push({ label: selectedYear.toString(), onClick: () => setSelectedMonth(null) });
        }

        if (selectedMonth) {
            crumbs.push({ label: selectedMonth, onClick: () => { } });
        }

        return crumbs;
    };

    // Render year selection
    const renderYearSelection = () => {
        const years = getYears();
        const yearCategories = years.map(year => ({
            id: year,
            title: year.toString(),
            description: `Browse current affairs tests from ${year}`,
            count: getTestCountForYear(year),
            colorClass: 'bg-orange-500',
            icon: (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        }));

        return (
            <CategoryNavigator
                categories={yearCategories}
                onCategoryClick={(category) => setSelectedYear(category.id)}
                title="Current Affairs by Year"
                description="Select a year to view monthly current affairs tests"
                breadcrumbs={getBreadcrumbs()}
            />
        );
    };

    // Render month selection
    const renderMonthSelection = () => {
        const monthsForYear = getMonthsForYear(selectedYear);
        const monthCategories = monthsForYear.map(month => ({
            id: month,
            title: month,
            description: `${selectedYear} ${month} current affairs tests`,
            count: getTestCountForMonth(selectedYear, month),
            colorClass: 'bg-blue-500',
            icon: (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            )
        }));

        return (
            <CategoryNavigator
                categories={monthCategories}
                onCategoryClick={(category) => setSelectedMonth(category.id)}
                title={`${selectedYear} Current Affairs`}
                description="Select a month to view tests"
                showBackButton={true}
                onBack={() => setSelectedYear(null)}
                breadcrumbs={getBreadcrumbs()}
            />
        );
    };

    // Render tests for selected month
    const renderTests = () => {
        const testsToShow = getTestsForMonth(selectedYear, selectedMonth);

        return (
            <div className="animate-fadeIn">
                {/* Breadcrumb and Back Button */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        {getBreadcrumbs().map((crumb, index) => (
                            <React.Fragment key={index}>
                                <button
                                    onClick={crumb.onClick}
                                    className="hover:text-blue-600 transition-colors font-medium"
                                >
                                    {crumb.label}
                                </button>
                                {index < getBreadcrumbs().length - 1 && (
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedMonth} {selectedYear}</h2>
                            <p className="text-gray-600 mt-1">{testsToShow.length} tests available</p>
                        </div>
                    </div>
                </div>

                {/* Tests Grid */}
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
                            <span className="text-orange-600 text-4xl">📰</span> Current Affairs
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Practice with Current Affairs mock tests to stay updated and boost your preparation.
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
                        {!selectedYear && renderYearSelection()}
                        {selectedYear && !selectedMonth && renderMonthSelection()}
                        {selectedYear && selectedMonth && renderTests()}
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

export default CurrentAffairsPage;
