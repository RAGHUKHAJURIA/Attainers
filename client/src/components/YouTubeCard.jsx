import React from "react";

const YouTubeCard = ({ video, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(video);
        } else {
            window.open(
                `https://www.youtube.com/watch?v=${video.videoId}`,
                "_blank"
            );
        }
    };

    const handleImageError = (e) => {
        const src = e.target.src;

        if (src.includes("hqdefault")) {
            e.target.src = `https://i.ytimg.com/vi/${video.videoId}/sddefault.jpg`;
        } else if (src.includes("sddefault")) {
            e.target.src = `https://i.ytimg.com/vi/${video.videoId}/default.jpg`;
        } else {
            e.target.style.display = "none";
        }
    };

    return (
        <div
            className="modern-card hover-lift cursor-pointer group"
            onClick={handleClick}
        >
            {/* Thumbnail */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={handleImageError}
                    loading="lazy"
                />

                {/* Play Button (NO black overlay) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                        <svg
                            className="w-6 h-6 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Featured Badge */}
                {video.isFeatured && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                            ⭐ Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="badge-primary">
                        {video.category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {video.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                </p>

                {/* Tags */}
                {video.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                        {video.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{video.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        {video.views} views
                    </span>

                    <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default YouTubeCard;
