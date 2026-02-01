import React from 'react';

const SectionCard = ({ title, description, icon, onClick, colorClass = "bg-blue-500" }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:-translate-y-1"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colorClass} text-white group-hover:scale-105 transition-transform duration-300`}>
                        {icon}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SectionCard;
