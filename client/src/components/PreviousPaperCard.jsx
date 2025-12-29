import React from 'react';

const PreviousPaperCard = ({ paper, onClick, isAdmin, onDelete }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(paper);
        } else {
            window.open(paper.fileUrl, '_blank');
        }
    };

    const getExamStyle = (examName) => {
        const lowerName = examName?.toLowerCase() || '';
        if (lowerName.includes('upsc')) return { bg: 'bg-orange-50', text: 'text-orange-600', icon: '🏛️' };
        if (lowerName.includes('ssc')) return { bg: 'bg-green-50', text: 'text-green-600', icon: '📊' };
        if (lowerName.includes('banking')) return { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '🏦' };
        if (lowerName.includes('jkssb')) return { bg: 'bg-blue-50', text: 'text-blue-600', icon: '🏔️' };
        return { bg: 'bg-gray-50', text: 'text-gray-600', icon: '📝' };
    };

    const style = getExamStyle(paper.examName);

    return (
        <div
            className="group relative bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-indigo-100 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={handleClick}
        >
            {/* Background Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${style.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center text-2xl shadow-sm group-hover:-rotate-12 transition-transform duration-300`}>
                        {style.icon}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                            {paper.year}
                        </span>
                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(paper._id);
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Delete Paper"
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
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                            {paper.examName}
                        </span>
                        {paper.difficulty && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${paper.difficulty === 'hard' ? 'bg-red-50 text-red-500' :
                                    paper.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-green-50 text-green-600'
                                }`}>
                                {paper.difficulty}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {paper.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Subject: <span className="font-medium text-gray-700">{paper.subject}</span>
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{paper.duration || '3 Hrs'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{paper.totalMarks || '100'} Marks</span>
                    </div>
                </div>

                {/* Footer Action */}
                <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                    <span>View Paper</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PreviousPaperCard;
