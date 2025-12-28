import React from 'react';

const PDFCard = ({ pdf, onClick, isAdmin, onDelete }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(pdf);
        } else {
            // Default behavior: open PDF in new tab
            window.open(pdf.fileUrl, '_blank');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'study-material': 'bg-blue-100 text-blue-700',
            'syllabus': 'bg-green-100 text-green-700',
            'notes': 'bg-yellow-100 text-yellow-700',
            'reference-books': 'bg-purple-100 text-purple-700',
            'question-banks': 'bg-red-100 text-red-700',
            'solved-papers': 'bg-indigo-100 text-indigo-700'
        };
        return colors[category] || colors['study-material'];
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div
            className="modern-card hover-lift cursor-pointer group"
            onClick={handleClick}
        >
            {/* PDF Icon Header */}
            <div className="gradient-primary p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{pdf.title}</h3>
                            <p className="text-red-100 text-sm">{pdf.subject}</p>
                        </div>
                    </div>
                    {pdf.isPaid && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ₹{pdf.price}
                        </div>
                    )}
                    {isAdmin && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(pdf._id);
                            }}
                            className="ml-2 p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm"
                            title="Delete PDF"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                    <span className="badge-primary">
                        {pdf.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                        {pdf.pages ? `${pdf.pages} pages` : 'PDF'}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {pdf.description}
                </p>

                {/* File Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            {pdf.downloadCount} downloads
                        </span>
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {formatFileSize(pdf.fileSize)}
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {pdf.tags && pdf.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {pdf.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                #{tag}
                            </span>
                        ))}
                        {pdf.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{pdf.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>by {pdf.author}</span>
                        <span>•</span>
                        <span>{new Date(pdf.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button className="btn-primary flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{pdf.isPaid ? 'Buy Now' : 'Download'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFCard;

