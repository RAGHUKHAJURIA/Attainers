import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import UpdateCard from './UpdateCard';

const UpdateSection = () => {
    const { allUpdates, fetchAllUpdates } = useContext(AppContext);
    const [selectedType, setSelectedType] = useState('all');

    const updateTypes = [
        { value: 'all', label: 'All Updates' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
        { value: 'important', label: 'Important', color: 'text-orange-600' },
        { value: 'general', label: 'General', color: 'text-blue-600' },
        { value: 'maintenance', label: 'Maintenance', color: 'text-gray-600' }
    ];

    useEffect(() => {
        fetchAllUpdates();
    }, []);

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
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Latest Updates & Announcements
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Stay informed with the latest news, important announcements, and system updates that matter to your educational journey.
                    </p>
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {updateTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setSelectedType(type.value)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedType === type.value
                                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Updates Grid */}
                {sortedUpdates.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {sortedUpdates.map((update) => (
                            <UpdateCard key={update._id} update={update} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
                        <p className="text-gray-500">
                            {selectedType !== 'all'
                                ? 'Try selecting a different type'
                                : 'Check back later for new updates'
                            }
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {allUpdates.length}
                            </div>
                            <div className="text-gray-600">Total Updates</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {allUpdates.filter(update => update.type === 'urgent').length}
                            </div>
                            <div className="text-gray-600">Urgent</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {allUpdates.filter(update => update.type === 'important').length}
                            </div>
                            <div className="text-gray-600">Important</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {allUpdates.filter(update => update.isActive).length}
                            </div>
                            <div className="text-gray-600">Active</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdateSection;

