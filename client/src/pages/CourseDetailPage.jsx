import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`https://attainers-272i.vercel.app/api/public/courses/${id}`);
                const data = await response.json();
                if (data.success) {
                    setCourse(data.course);
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <button onClick={() => window.history.back()} className="text-gray-600 hover:text-blue-600 flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Courses
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Info */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-4">
                                    {course.category}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{course.title}</h1>
                                <p className="text-xl text-gray-600 max-w-3xl">{course.description}</p>
                            </div>

                            {/* Enroll / Action Card (if paid or special action needed, currently just info) */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[250px]">
                                <div className="text-sm text-gray-500 mb-1">Instructor</div>
                                <div className="font-semibold text-gray-900 mb-4">{course.instructor}</div>

                                <div className="text-sm text-gray-500 mb-1">Level</div>
                                <div className="font-semibold text-gray-900">{course.level}</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {course.isYouTube && course.playlistId ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                                <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-xl overflow-hidden shadow-lg">
                                    <iframe
                                        className="w-full h-[600px]"
                                        src={`https://www.youtube.com/embed/videoseries?list=${course.playlistId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="text-gray-600 italic mt-4">
                                    Browse the playlist above to watch all videos in this course.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">
                                    This course content is not available in playlist format or is hosted externally.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CourseDetailPage;
