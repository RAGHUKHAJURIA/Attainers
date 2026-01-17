import React from 'react';

const CardSkeleton = () => {
    return (
        <div className="flex flex-col bg-neutral-200/50 w-full h-full animate-pulse rounded-xl p-4 gap-4 border border-neutral-100 shadow-sm">
            {/* Image Placeholder */}
            <div className="bg-neutral-300/50 w-full h-32 animate-pulse rounded-lg"></div>

            {/* Content Placeholders */}
            <div className="flex flex-col gap-3">
                {/* Title */}
                <div className="bg-neutral-300/50 w-full h-5 animate-pulse rounded-md"></div>
                {/* Subtitle/Text */}
                <div className="bg-neutral-300/50 w-4/5 h-4 animate-pulse rounded-md"></div>

                {/* Extra lines/Tags */}
                <div className="flex gap-2 mt-2">
                    <div className="bg-neutral-300/50 w-1/4 h-4 animate-pulse rounded-md"></div>
                    <div className="bg-neutral-300/50 w-1/4 h-4 animate-pulse rounded-md"></div>
                </div>

                {/* Button/Action */}
                <div className="bg-neutral-300/50 w-full h-10 mt-2 animate-pulse rounded-lg"></div>
            </div>
        </div>
    );
};

export default CardSkeleton;
