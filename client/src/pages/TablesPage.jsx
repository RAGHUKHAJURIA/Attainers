import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import TableCard from '../components/TableCard';
import Footer from '../components/Footer';
import { useUser, useAuth } from '@clerk/clerk-react';

const TablesPage = () => {
    const { allTables, fetchAllTables, backendUrl } = useContext(AppContext);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All Tables' },
        { value: 'exam-schedule', label: 'Exam Schedules' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'results', label: 'Results' },
        { value: 'admit-cards', label: 'Admit Cards' },
        { value: 'notifications', label: 'Notifications' },
        { value: 'cutoff-marks', label: 'Cutoff Marks' }
    ];

    useEffect(() => {
        fetchAllTables();
    }, []);

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this table?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/tables/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchAllTables(); // Refresh list via Context
            } else {
                const data = await response.json();
                alert(`Failed to delete table: ${data.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting table:', error);
            alert("Error deleting table.");
        }
    };

    const filteredTables = selectedCategory === 'all'
        ? allTables
        : allTables.filter(table => table.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <SEO
                title="Data Tables - Schedules & Results"
                description="View exam schedules, syllabus, results, and cutoff marks in an organized table format."
                keywords="Exam Schedule, Syllabus, Results, Cutoff Marks, Date Sheet"
            />
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-yellow-600 text-4xl">📊</span> Data Tables
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Access exam schedules, results, key dates, and official notifications in structured formats.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Admin Action Placeholders */}
                        {isAdmin && (
                            <button
                                onClick={() => alert("Add Table functionality requires specific modal (not customized for tables yet).")}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Table
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.value
                                ? 'bg-yellow-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSelectedCategory(category.value)}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {filteredTables.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTables.map((table) => (
                            <TableCard
                                key={table._id}
                                table={table}
                                isAdmin={isAdmin}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tables found</h3>
                        <p className="text-gray-500 mt-1">Try selecting a different category.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TablesPage;
