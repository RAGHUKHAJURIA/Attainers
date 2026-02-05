import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TestCard = ({ id, _id, title, examName, totalQuestions, questions, duration, difficulty, isAdmin, onDelete, viewCount, isPublished, onTogglePublish }) => {
    const testId = id || _id;

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const link = `${window.location.origin}/mock-tests/${testId}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        });
    };
    return (
        <div className="modern-card p-6 flex flex-col h-full hover-lift relative group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="badge-primary mb-2 inline-block">
                        {examName}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-md text-xs font-semibold ${difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {difficulty}
                    </div>
                    {/* Copy Link Button */}
                    <button
                        onClick={handleCopyLink}
                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Copy Link"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(testId);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Test"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {questions ? questions.length : (totalQuestions || 0)} Questions
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {duration} Minutes
                </div>
                {isAdmin && (
                    <div className="flex justify-between items-center w-full mt-2">
                        <div className="flex items-center text-indigo-600 text-sm font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {viewCount || 0} Views
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onTogglePublish) onTogglePublish(testId, !isPublished);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${isPublished
                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {isPublished ? 'Published' : 'Private'}
                        </button>
                    </div>
                )}
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
