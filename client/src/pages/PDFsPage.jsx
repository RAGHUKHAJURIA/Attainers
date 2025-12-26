import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import PDFCard from '../components/PDFCard';
import Footer from '../components/Footer';

const PDFsPage = () => {
    const { allPDFs, fetchAllPDFs } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [showPaidOnly, setShowPaidOnly] = useState(false);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'study-material', label: 'Study Material' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'notes', label: 'Notes' },
        { value: 'reference-books', label: 'Reference Books' },
        { value: 'question-banks', label: 'Question Banks' },
        { value: 'solved-papers', label: 'Solved Papers' }
    ];

    const subjects = [
        'all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
        'History', 'Geography', 'Political Science', 'Economics', 'Computer Science',
        'General Knowledge', 'Current Affairs', 'Reasoning', 'Quantitative Aptitude'
    ];

    useEffect(() => {
        fetchAllPDFs();
    }, []);

    const filteredPDFs = allPDFs.filter(pdf => {
        if (selectedCategory !== 'all' && pdf.category !== selectedCategory) return false;
        if (selectedSubject !== 'all' && pdf.subject !== selectedSubject) return false;
        if (showPaidOnly && !pdf.isPaid) return false;
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">PDF Resources</h1>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Access comprehensive study materials, notes, and reference books to enhance your learning experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="filter-section">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                            {/* Subject Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="modern-select"
                                >
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>
                                            {subject === 'all' ? 'All Subjects' : subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Paid Filter */}
                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showPaidOnly}
                                        onChange={(e) => setShowPaidOnly(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">Show paid content only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* PDFs Grid */}
                    {filteredPDFs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPDFs.map((pdf) => (
                                <PDFCard key={pdf._id} pdf={pdf} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more content</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="stats-section">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allPDFs.length}
                                </div>
                                <div className="text-gray-600">Total PDFs</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allPDFs.filter(pdf => !pdf.isPaid).length}
                                </div>
                                <div className="text-gray-600">Free PDFs</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    {allPDFs.filter(pdf => pdf.isPaid).length}
                                </div>
                                <div className="text-gray-600">Paid PDFs</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-800 mb-2">
                                    {allPDFs.reduce((total, pdf) => total + pdf.downloadCount, 0)}
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

export default PDFsPage;

