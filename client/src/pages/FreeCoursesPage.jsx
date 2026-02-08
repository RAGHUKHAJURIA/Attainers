import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import CardSkeleton from '../components/CardSkeleton';

const FreeCoursesPage = () => {
    const { backendUrl } = useContext(AppContext);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlistUrl, setPlaylistUrl] = useState('');

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    useEffect(() => {
        fetchCourses();
    }, [backendUrl]); // Fetch on mount

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/public/free-courses`);
            const data = await res.json();
            if (data.success) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = await getToken();
            const res = await fetch(`${backendUrl}/api/admin/free-courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ playlistUrl })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Course added successfully!');
                setPlaylistUrl('');
                setIsModalOpen(false);
                fetchCourses();
            } else {
                toast.error(data.message || 'Failed to add course');
            }
        } catch (error) {
            toast.error('Error adding course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const token = await getToken();
            const res = await fetch(`${backendUrl}/api/admin/free-courses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                toast.success('Course deleted');
                fetchCourses();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting course');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Free Courses</h1>
                        <p className="text-gray-600 mt-1">Curated YouTube Playlists for your preparation</p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Course
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📺</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No courses available yet</h3>
                        <p className="text-gray-500">Check back later for new content!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                                {/* Thumbnail Section */}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
                                    />
                                    {/* Overlay */}
                                    <a
                                        href={course.playlistLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"
                                    >
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 transform scale-75 group-hover:scale-100 transition-all duration-300">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </a>

                                    {/* Admin Delete Button - Absolute Top Right */}
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDelete(course._id);
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-700 hover:bg-white shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                                            title="Delete Course"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                                        <a href={course.playlistLink} target="_blank" rel="noopener noreferrer">
                                            {course.title}
                                        </a>
                                    </h3>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <a
                                            href={course.playlistLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-blue-600 flex items-center gap-1 group/link"
                                        >
                                            Watch Now
                                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                        <span className="text-xs text-gray-400 font-medium">YouTube</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Free Course</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddCourse}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Playlist URL</label>
                                <input
                                    type="url"
                                    required
                                    className="modern-input w-full"
                                    placeholder="https://www.youtube.com/playlist?list=..."
                                    value={playlistUrl}
                                    onChange={(e) => setPlaylistUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">Thumbnail and Title will be auto-detected.</p>
                            </div>



                            <button
                                type="submit"
                                disabled={submitting}
                                className={`btn-primary w-full py-3 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? 'Fetching & Adding...' : 'Add Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default FreeCoursesPage;
