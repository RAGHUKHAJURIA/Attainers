import React from 'react';
import { Link } from 'react-router-dom';

const TestCard = ({ id, _id, title, examName, totalQuestions, duration, difficulty }) => {
    const testId = id || _id;
    return (
        <div className="modern-card p-6 flex flex-col h-full hover-lift">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="badge-primary mb-2 inline-block">
                        {examName}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {title}
                    </h3>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-semibold ${difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {difficulty}
                </div>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {totalQuestions} Questions
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {duration} Minutes
                </div>
            </div>

            <Link to={`/mock-tests/${testId}`} className="btn-primary w-full flex items-center justify-center group text-center no-underline">
                Start Test
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
    );
};

export default TestCard;
