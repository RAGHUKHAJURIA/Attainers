import React, { useState } from 'react';

const TableCard = ({ table, onClick }) => {
    const [showFullTable, setShowFullTable] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick(table);
        } else {
            setShowFullTable(!showFullTable);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'exam-schedule': 'bg-blue-100 text-blue-700',
            'syllabus': 'bg-green-100 text-green-700',
            'results': 'bg-purple-100 text-purple-700',
            'admit-cards': 'bg-orange-100 text-orange-700',
            'notifications': 'bg-red-100 text-red-700',
            'cutoff-marks': 'bg-yellow-100 text-yellow-700'
        };
        return colors[category] || colors.general;
    };

    const previewRows = table.data.slice(0, 3);
    const remainingRows = table.data.length - 3;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(table.category)}`}>
                        {table.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                        {table.data.length} rows
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {table.title}
                </h3>

                <p className="text-gray-600 mb-4">
                    {table.description}
                </p>

                {table.source && (
                    <p className="text-sm text-gray-500">
                        Source: {table.source}
                    </p>
                )}
            </div>

            {/* Table Preview */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        {/* Headers */}
                        <thead>
                            <tr className="border-b border-gray-200">
                                {table.headers.map((header, index) => (
                                    <th key={index} className="text-left py-2 px-3 font-semibold text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Data Rows */}
                        <tbody>
                            {previewRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                                    {row.row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="py-2 px-3 text-gray-600">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {remainingRows > 0 && (
                                <tr>
                                    <td colSpan={table.headers.length} className="py-2 px-3 text-center text-gray-500 italic">
                                        ... and {remainingRows} more rows
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Action Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Full Table
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                        Updated: {new Date(table.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                        {table.headers.length} columns
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TableCard;

