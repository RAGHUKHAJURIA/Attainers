import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import PreviousPaperCard from '../components/PreviousPaperCard';
import Footer from '../components/Footer';

const PreviousPapersPage = () => {
    const { allPreviousPapers, fetchAllPreviousPapers } = useContext(AppContext);
    const [selectedExam, setSelectedExam] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const examNames = ['all', 'UPSC', 'SSC', 'Banking', 'Railway', 'Defense', 'State PSC'];
    const years = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'upsc', label: 'UPSC' },
        { value: 'ssc', label: 'SSC' },
        { value: 'banking', label: 'Banking' },
        { value: 'railway', label: 'Railway' },
        { value: 'defense', label: 'Defense' },
        { value: 'state-psc', label: 'State PSC' }
    ];

    useEffect(() => {
        fetchAllPreviousPapers();
    }, []);

    const filteredPapers = allPreviousPapers.filter(paper => {
        if (selectedExam !== 'all' && !paper.examName.toLowerCase().includes(selectedExam.toLowerCase())) return false;
        if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) return false;
        if (selectedCategory !== 'all' && paper.category !== selectedCategory) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                {/* Header */}
                <div className="section-header">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">Previous Year Papers</h1>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Access previous year question papers from various competitive exams to practice and prepare effectively.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="filter-section">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Exam Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam</label>
                                <select
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    className="modern-select"
                                >
                                    {examNames.map(exam => (
                                        <option key={exam} value={exam}>
                                            {exam === 'all' ? 'All Exams' : exam}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="modern-select"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year === 'all' ? 'All Years' : year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="modern-select"
                                >
                                    {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Papers Grid */}
                    {filteredPapers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPapers.map((paper) => (
                                <PreviousPaperCard key={paper._id} paper={paper} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more content</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-section">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allPreviousPapers.length}
                                </div>
                                <div className="text-gray-600">Total Papers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    {allPreviousPapers.filter(paper => paper.isPaid).length}
                                </div>
                                <div className="text-gray-600">Paid Papers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allPreviousPapers.filter(paper => !paper.isPaid).length}
                                </div>
                                <div className="text-gray-600">Free Papers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {allPreviousPapers.reduce((total, paper) => total + paper.downloadCount, 0)}
                                </div>
                                <div className="text-gray-600">Total Downloads</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PreviousPapersPage;

