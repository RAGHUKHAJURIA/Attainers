import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import TableCard from './TableCard';

const TableSection = () => {
    const { allTables, fetchAllTables } = useContext(AppContext);
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

    const filteredTables = selectedCategory === 'all'
        ? allTables
        : allTables.filter(table => table.category === selectedCategory);

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Data Tables & Information
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Access structured data including exam schedules, results, syllabus information, and important notifications in an organized format.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.value
                                    ? 'bg-yellow-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Tables Grid */}
                {filteredTables.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTables.map((table) => (
                            <TableCard key={table._id} table={table} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
                        <p className="text-gray-500">
                            {selectedCategory !== 'all'
                                ? 'Try selecting a different category'
                                : 'Check back later for new data tables'
                            }
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {allTables.length}
                            </div>
                            <div className="text-gray-600">Total Tables</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {allTables.filter(table => table.category === 'exam-schedule').length}
                            </div>
                            <div className="text-gray-600">Exam Schedules</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {allTables.filter(table => table.category === 'results').length}
                            </div>
                            <div className="text-gray-600">Results</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {allTables.reduce((total, table) => total + table.data.length, 0)}
                            </div>
                            <div className="text-gray-600">Total Rows</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TableSection;

