import React from 'react';

const PreviousPaperCard = ({ paper, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(paper);
        } else {
            // Default behavior: open paper in new tab
            window.open(paper.fileUrl, '_blank');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'upsc': 'bg-blue-100 text-blue-700',
            'ssc': 'bg-green-100 text-green-700',
            'banking': 'bg-purple-100 text-purple-700',
            'railway': 'bg-orange-100 text-orange-700',
            'defense': 'bg-red-100 text-red-700',
            'state-psc': 'bg-indigo-100 text-indigo-700',
            'other': 'bg-gray-100 text-gray-700'
        };
        return colors[category] || colors['other'];
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'easy': 'bg-green-100 text-green-700',
            'medium': 'bg-yellow-100 text-yellow-700',
            'hard': 'bg-red-100 text-red-700'
        };
        return colors[difficulty] || colors['medium'];
    };

    const getPaperTypeColor = (paperType) => {
        const colors = {
            'prelims': 'bg-blue-100 text-blue-700',
            'mains': 'bg-green-100 text-green-700',
            'interview': 'bg-purple-100 text-purple-700',
            'written': 'bg-orange-100 text-orange-700',
            'objective': 'bg-yellow-100 text-yellow-700',
            'subjective': 'bg-red-100 text-red-700'
        };
        return colors[paperType] || colors['objective'];
    };

    return (
        <div
            className="modern-card hover-lift cursor-pointer group"
            onClick={handleClick}
        >
            {/* Header */}
            <div className="gradient-primary p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{paper.examName}</h3>
                            <p className="text-orange-100 text-sm">{paper.year}</p>
                        </div>
                    </div>
                    {paper.isPaid && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ₹{paper.price}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {paper.title}
                </h4>

                {/* Subject */}
                <p className="text-gray-600 mb-3 text-sm">
                    Subject: {paper.subject}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge-primary">
                        {paper.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="badge-secondary">
                        {paper.paperType.toUpperCase()}
                    </span>
                    <span className="badge-secondary">
                        {paper.difficulty.toUpperCase()}
                    </span>
                </div>

                {/* Paper Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    {paper.totalMarks && (
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{paper.totalMarks} marks</span>
                        </div>
                    )}
                    {paper.duration && (
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{paper.duration}</span>
                        </div>
                    )}
                    {paper.pages && (
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{paper.pages} pages</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {paper.tags && paper.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {paper.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                #{tag}
                            </span>
                        ))}
                        {paper.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{paper.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            {paper.downloadCount} downloads
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        by {paper.uploadedBy}
                    </div>
                </div>

                {/* Action Button */}
                <button className="btn-primary w-full mt-4">
                    {paper.isPaid ? 'Buy Now' : 'Download'}
                </button>
            </div>
        </div>
    );
};

export default PreviousPaperCard;

