import React from 'react';

const CategoryNavigator = ({
    categories,
    onCategoryClick,
    onBack,
    title,
    description,
    showBackButton = false,
    breadcrumbs = [],
    onDelete,
    onTogglePublish
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onCategoryClick(category)}
                        className={`modern-card p-4 sm:p-6 text-left hover-lift group relative cursor-pointer ${category.isPublished === false ? 'opacity-75 bg-gray-50' : ''}`}
                    >
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            {/* Publish Toggle Button */}
                            {onTogglePublish && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePublish(category);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${category.isPublished
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                    title={category.isPublished ? "Published" : "Unpublished"}
                                >
                                    {category.isPublished ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            )}

                            {/* Delete Button */}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(category);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Icon */}
                        {category.icon && (
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${category.colorClass || 'bg-blue-500'} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                                {category.icon}
                            </div>
                        )}

                        {/* Title and Badge */}
                        <div className="flex items-start justify-between mb-2 pr-8">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {category.title}
                            </h3>
                            {category.count !== undefined && (
                                <span className="badge-primary text-xs sm:text-sm">{category.count}</span>
                            )}
                        </div>

                        {/* Description */}
                        {category.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{category.description}</p>
                        )}

                        {/* Arrow Icon */}
                        <div className="flex items-center text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform">
                            <span>Explore</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryNavigator;
