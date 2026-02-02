import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import AddCourseModal from '../components/AddCourseModal';
import CardSkeleton from '../components/CardSkeleton';
import SectionCard from '../components/SectionCard';
import SubjectWiseCourses from '../components/courses/SubjectWiseCourses';
import ExamWiseCourses from '../components/courses/ExamWiseCourses';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';



const CoursesPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [activeSection, setActiveSection] = useState(null); // 'subject-wise', 'exam-wise', etc.


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
        } finally {
            setLoading(false);
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

    // Filter logic for non-"All" tabs
    const filteredCourses = courses.filter(course => {
        if (searchTerm) {
            return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (activeTab === 'All') return true;
        // Map tabs to categories if needed, or simple string match
        // Heuristic: Check if category includes tab name parts or exact match
        // Adjust this mapping based on actual category values
        const tabKey = activeTab.toLowerCase().replace(' ', '-');
        return course.category.toLowerCase().includes(tabKey);
    });

    // Logic for "All" tab sections
    const renderAllTabContent = () => {
        if (activeSection === 'subject-wise') {
            return (
                <SubjectWiseCourses
                    courses={courses}
                    onCourseClick={handleCardClick}
                    onBack={() => setActiveSection(null)}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                />
            );
        }

        if (activeSection === 'exam-wise') {
            return (
                <ExamWiseCourses
                    courses={courses}
                    onCourseClick={handleCardClick}
                    onBack={() => setActiveSection(null)}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in">
                <SectionCard
                    title="Mock Tests"
                    description="Practice with full-length mock tests designed to simulate real exam conditions."
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    }
                    colorClass="bg-blue-500"
                    onClick={() => navigate('/mock-tests')}
                />

                <SectionCard
                    title="J & K Current Affairs"
                    description="Stay informed with the latest news, updates, and important announcements."
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    }
                    colorClass="bg-orange-500"
                    onClick={() => navigate('/current-affairs')}
                />

                <SectionCard
                    title="Subject Wise"
                    description="Browse courses and study materials organized by specific subjects."
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                    colorClass="bg-green-500"
                    onClick={() => navigate('/mock-tests/subject-wise')}
                />

                <SectionCard
                    title="Exam Wise"
                    description="Find targeted courses and resources for specific competitive exams."
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    colorClass="bg-red-500"
                    onClick={() => navigate('/mock-tests/exam-wise')}
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
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

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['All', 'Mock Tests', 'J&K Current Affairs', 'Subject Wise', 'Exam Wise'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            onClick={() => {
                                if (tab === 'Mock Tests') {
                                    navigate('/mock-tests');
                                    return;
                                }
                                if (tab === 'J&K Current Affairs') {
                                    navigate('/current-affairs');
                                    return;
                                }
                                if (tab === 'Subject Wise') {
                                    navigate('/mock-tests/subject-wise');
                                    return;
                                }
                                if (tab === 'Exam Wise') {
                                    navigate('/mock-tests/exam-wise');
                                    return;
                                }

                                setActiveTab(tab);
                                setActiveSection(null);
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[60vh]">
                        {(activeTab === 'All' || activeSection) && !searchTerm ? (
                            renderAllTabContent()
                        ) : (
                            // Render standard course grid for other tabs or search
                            filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 animate-fade-in">
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
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
                                </div>
                            )
                        )}
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
