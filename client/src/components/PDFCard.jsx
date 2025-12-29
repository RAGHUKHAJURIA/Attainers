import React from 'react';

const PDFCard = ({ pdf, onClick, isAdmin, onDelete }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(pdf);
        } else {
            // Use the secure download endpoint
            const apiUrl = 'https://attainers-272i.vercel.app/api/public';
            // For paid PDFs, we might still want to open/preview or check payment, 
            // but for now applying download link as requested for general usage.
            // If isPaid is true, typical flow might correspond to a proper purchase check,
            // but assuming public PDFs or unlocked ones for this context.
            window.location.href = `${apiUrl}/download/pdf/${pdf._id}`;
        }
    };

    const getCategoryStyle = (category) => {
        const styles = {
            'study-material': { bg: 'bg-blue-50', text: 'text-blue-600', icon: '📚' },
            'syllabus': { bg: 'bg-green-50', text: 'text-green-600', icon: '📋' },
            'notes': { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: '📝' },
            'reference-books': { bg: 'bg-purple-50', text: 'text-purple-600', icon: '📖' },
            'question-banks': { bg: 'bg-red-50', text: 'text-red-600', icon: '❓' },
            'solved-papers': { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '✅' }
        };
        return styles[category] || styles['study-material'];
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const style = getCategoryStyle(pdf.category);

    return (
        <div
            className="group relative bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-100 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={handleClick}
        >
            {/* Background Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${style.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform duration-300`}>
                        {style.icon}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {pdf.isPaid && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                                ₹{pdf.price}
                            </span>
                        )}
                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(pdf._id);
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
                <div className="mb-4">
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">
                        {pdf.subject}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {pdf.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 h-10">
                        {pdf.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>{formatFileSize(pdf.fileSize)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <span>{pdf.pages || '?'} Pages</span>
                    </div>
                </div>

                {/* Footer Action */}
                <button
                    onClick={handleClick}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${pdf.isPaid
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                        }`}>
                    <span>{pdf.isPaid ? 'Unlock Now' : 'Download Now'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PDFCard;
