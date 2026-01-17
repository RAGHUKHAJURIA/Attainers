import React from 'react';

const Loading = ({ size = "medium", className = "" }) => {
    // Size mapping
    const dimensions = {
        small: "w-8 h-8",
        medium: "w-16 h-16",
        large: "w-24 h-24",
        xl: "w-32 h-32"
    };

    const sizeClass = dimensions[size] || dimensions.medium;

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`${sizeClass} relative`}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full overflow-visible"
                >
                    {/* 
                       Stylized A - Faster & Centered
                       Peak: 50,15 
                       Feet: 30,85 & 70,85
                       Crossbar: Angled slightly (64,65 -> 32,48)
                    */}

                    {/* Main Chevron */}
                    <path
                        d="M30 85 L50 15 L70 85"
                        stroke="black"
                        strokeWidth="8"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                        className="animate-logo-stroke"
                        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                    />

                    {/* Angled Crossbar */}
                    <path
                        d="M62 65 L32 48"
                        stroke="black"
                        strokeWidth="8"
                        strokeLinecap="butt"
                        className="animate-logo-cross"
                        style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
                    />
                </svg>
            </div>
            <style>{`
                .animate-logo-stroke { animation: strokeMain 1s ease-in-out infinite; }
                .animate-logo-cross { animation: strokeCross 1s ease-in-out infinite; }

                @keyframes strokeMain {
                    0% { stroke-dashoffset: 200; opacity: 0; }
                    5% { opacity: 1; }
                    40% { stroke-dashoffset: 0; }
                    80% { stroke-dashoffset: 0; opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                }

                @keyframes strokeCross {
                    0% { stroke-dashoffset: 60; opacity: 0; }
                    30% { stroke-dashoffset: 60; opacity: 0; }
                    35% { opacity: 1; }
                    60% { stroke-dashoffset: 0; }
                    80% { stroke-dashoffset: 0; opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Loading;
