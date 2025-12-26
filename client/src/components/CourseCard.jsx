import React from 'react';

const CourseCard = ({ course, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(course);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'government-exams': 'bg-blue-100 text-blue-700',
            'competitive-exams': 'bg-red-100 text-red-700',
            'academic': 'bg-green-100 text-green-700',
            'skill-development': 'bg-purple-100 text-purple-700',
            'language': 'bg-yellow-100 text-yellow-700',
            'certification': 'bg-indigo-100 text-indigo-700'
        };
        return colors[category] || colors['academic'];
    };

    const getLevelColor = (level) => {
        const colors = {
            'beginner': 'bg-green-100 text-green-700',
            'intermediate': 'bg-yellow-100 text-yellow-700',
            'advanced': 'bg-orange-100 text-orange-700',
            'expert': 'bg-red-100 text-red-700'
        };
        return colors[level] || colors['beginner'];
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="half">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }

        return stars;
    };

    return (
        <div
            className="modern-card hover-lift cursor-pointer group"
            onClick={handleClick}
        >
            {/* Course Thumbnail */}
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {course.isFeatured && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ⭐ Featured
                        </span>
                    </div>
                )}
                {course.discount > 0 && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {course.discount}% OFF
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Category and Level */}
                <div className="flex items-center justify-between mb-3">
                    <span className="badge-primary">
                        {course.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="badge-secondary">
                        {course.level.toUpperCase()}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {course.title}
                </h3>

                {/* Short Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.shortDescription}
                </p>

                {/* Instructor */}
                <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">by {course.instructor}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                        {renderStars(course.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                        {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                    </span>
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{course.videoCount} videos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration}</span>
                    </div>
                </div>

                {/* Price and Enrollments */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">₹{course.price}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                            <span className="text-lg text-gray-500 line-through">₹{course.originalPrice}</span>
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        {course.enrollmentCount} enrolled
                    </div>
                </div>

                {/* Enroll Button */}
                <button className="btn-primary w-full mt-4">
                    Enroll Now
                </button>
            </div>
        </div>
    );
};

export default CourseCard;

