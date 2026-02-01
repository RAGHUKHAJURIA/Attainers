import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

import Navbar from '../components/Navbar';
import UpdateCard from '../components/UpdateCard';
import Footer from '../components/Footer';
import CardSkeleton from '../components/CardSkeleton';
import { useUser, useAuth } from '@clerk/clerk-react';

const UpdatesPage = () => {
    const { allUpdates, fetchAllUpdates, backendUrl } = useContext(AppContext);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [loading, setLoading] = useState(true);

    const updateTypes = [
        { value: 'all', label: 'All Updates' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
        { value: 'important', label: 'Important', color: 'text-orange-600' },
        { value: 'general', label: 'General', color: 'text-blue-600' },
        { value: 'maintenance', label: 'Maintenance', color: 'text-gray-600' }
    ];

    useEffect(() => {
        const loadUpdates = async () => {
            await fetchAllUpdates();
            setLoading(false);
        };
        loadUpdates();
    }, []);

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this update?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/updates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchAllUpdates(); // Refresh list via Context
            } else {
                const data = await response.json();
                alert(`Failed to delete update: ${data.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting update:', error);
            alert("Error deleting update.");
        }
    };

    const filteredUpdates = selectedType === 'all'
        ? allUpdates
        : allUpdates.filter(update => update.type === selectedType);

    // Sort updates by priority and date
    const sortedUpdates = filteredUpdates.sort((a, b) => {
        if (a.priority !== b.priority) {
            return b.priority - a.priority; // Higher priority first
        }
        return new Date(b.createdAt) - new Date(a.createdAt); // Newer first
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-purple-600 text-4xl">📢</span> Current Affairs
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Stay informed with the latest news and important announcements.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Admin Action Placeholders - Add Update Modal can be added here */}
                        {isAdmin && (
                            <button
                                onClick={() => alert("Add Update functionality requires specific modal (not customized for updates yet). Use direct DB or wait for modal implementation.")}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Update
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {updateTypes.map((type) => (
                        <button
                            key={type.value}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedType === type.value
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSelectedType(type.value)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : sortedUpdates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {sortedUpdates.map((update) => (
                            <UpdateCard
                                key={update._id}
                                update={update}
                                isAdmin={isAdmin}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No updates found</h3>
                        <p className="text-gray-500 mt-1">Try selecting a different type.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default UpdatesPage;
