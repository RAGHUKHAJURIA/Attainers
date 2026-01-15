import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import AddCourseModal from '../components/AddCourseModal';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';


const CoursesPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/courses');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCourses(data.courses);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const { createContent } = useContext(AppContext);

    const handleAddCourse = async (newCourse) => {
        const result = await createContent('courses', newCourse);
        if (result) {
            fetchCourses();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`https://attainers-272i.vercel.app/api/admin/courses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setCourses(courses.filter(course => course._id !== id));
            } else {
                alert("Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleCardClick = (course) => {
        navigate(`/courses/${course._id}`);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <SEO
                title="Courses & Playlists - Video Lectures"
                description="Access comprehensive video courses and curated playlists for competitive exam preparation. Learn from experts."
                keywords="Video Courses, Online Classes, JKSSB Lectures, SSC Coaching, Free Playlists"
            />
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Courses & Playlists
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Explore comprehensive video courses and curated playlists.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="modern-input !pl-14"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Course
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['All', 'Academic', 'Competitive Exams', 'Skill Development'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${searchTerm === '' && filter === 'All' ? 'bg-blue-600 text-white' :
                                filter !== 'All' && searchTerm.toLowerCase().includes(filter.toLowerCase().replace(' ', '-')) ? 'bg-blue-600 text-white' :
                                    'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            onClick={() => setSearchTerm(filter === 'All' ? '' : filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    onClick={handleCardClick}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </main>

            <Footer />

            <AddCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddCourse}
            />
        </div>
    );
};

export default CoursesPage;
