import React from 'react';

const UpdateCard = ({ update, isAdmin, onDelete }) => {
    const getTypeColor = (type) => {
        const colors = {
            'urgent': 'bg-red-100 text-red-700 border-red-200',
            'important': 'bg-orange-100 text-orange-700 border-orange-200',
            'general': 'bg-blue-100 text-blue-700 border-blue-200',
            'maintenance': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[type] || colors.general;
    };

    const getPriorityIcon = (priority) => {
        if (priority >= 4) return '🔴';
        if (priority >= 3) return '🟠';
        if (priority >= 2) return '🟡';
        return '🟢';
    };

    const isExpired = update.expiryDate && new Date(update.expiryDate) < new Date();

    return (
        <div className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${update.type === 'urgent' ? 'border-red-200' :
            update.type === 'important' ? 'border-orange-200' :
                'border-gray-200'
            }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${update.type === 'urgent' ? 'bg-red-50' :
                update.type === 'important' ? 'bg-orange-50' :
                    'bg-gray-50'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(update.type)}`}>
                            {update.type.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                            {getPriorityIcon(update.priority)}
                            Priority {update.priority}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpired && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                Expired
                            </span>
                        )}
                        {isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(update._id);
                                }}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Update"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {update.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                    {update.content}
                </p>

                {update.image && (
                    <div className="mb-4">
                        {update.image.toLowerCase().endsWith('.pdf') ? (
                            <a
                                href={update.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Download Attachment (PDF)</span>
                            </a>
                        ) : (
                            <img
                                src={update.image}
                                alt="Attachment"
                                className="rounded-lg max-h-64 object-cover border border-gray-100 w-full md:w-auto"
                            />
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(update.createdAt).toLocaleDateString()}
                        </span>
                        {update.expiryDate && (
                            <span className={`flex items-center gap-1 ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Expires: {new Date(update.expiryDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCard;

