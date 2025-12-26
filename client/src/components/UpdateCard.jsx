import React from 'react';

const UpdateCard = ({ update }) => {
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
                    {isExpired && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Expired
                        </span>
                    )}
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

