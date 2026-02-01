import React from 'react';

const CategoryNavigator = ({
    categories,
    onCategoryClick,
    onBack,
    title,
    description,
    showBackButton = false,
    breadcrumbs = []
}) => {
    return (
        <div className="animate-fadeIn">
            {/* Breadcrumb Navigation */}
            {breadcrumbs.length > 0 && (
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            <button
                                onClick={crumb.onClick}
                                className="hover:text-blue-600 transition-colors font-medium"
                            >
                                {crumb.label}
                            </button>
                            {index < breadcrumbs.length - 1 && (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                {showBackButton && (
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {description && <p className="text-gray-600 mt-1">{description}</p>}
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryClick(category)}
                        className="modern-card p-6 text-left hover-lift group"
                    >
                        {/* Icon */}
                        {category.icon && (
                            <div className={`w-14 h-14 ${category.colorClass || 'bg-blue-500'} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                {category.icon}
                            </div>
                        )}

                        {/* Title and Badge */}
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {category.title}
                            </h3>
                            {category.count !== undefined && (
                                <span className="badge-primary">{category.count}</span>
                            )}
                        </div>

                        {/* Description */}
                        {category.description && (
                            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                        )}

                        {/* Arrow Icon */}
                        <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                            <span>Explore</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryNavigator;
