import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import AddBlogModal from '../components/AddBlogModal';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const BlogsPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All Posts' },
        { value: 'study-material', label: 'Study Material' },
        { value: 'career-guidance', label: 'Career Guidance' },
        { value: 'government-jobs', label: 'Government Jobs' },
        { value: 'exam-updates', label: 'Exam Updates' },
        { value: 'general', label: 'General' }
    ];

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        if (isLoaded && user) {
            setIsAdmin(user.publicMetadata?.role === 'admin');
        }
    }, [isLoaded, user]);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('https://attainers-272i.vercel.app/api/public/blogs');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setBlogs(data.blogs);
                }
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleAddBlog = async (newBlog) => {
        try {
            const token = await getToken();
            const response = await fetch('https://attainers-272i.vercel.app/api/admin/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newBlog)
            });

            if (response.ok) {
                fetchBlogs(); // Refresh list
            } else {
                const errData = await response.json();
                alert(`Failed to create blog: ${errData.message}`);
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert("Error creating blog. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = await getToken();
            const response = await fetch(`https://attainers-272i.vercel.app/api/admin/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBlogs(blogs.filter(blog => blog._id !== id));
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleCardClick = (blog) => {
        navigate(`/blogs/${blog._id}`);
    };

    const filteredBlogs = selectedCategory === 'all'
        ? blogs
        : blogs.filter(blog => blog.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="pt-24 pb-12">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-6 mb-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Educational Hub</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Insights, guides, and the latest updates to supercharge your preparation.
                        </p>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === category.value
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        {/* Admin Add Button */}
                        {isAdmin && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary whitespace-nowrap flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Post
                            </button>
                        )}
                    </div>
                </div>

                {/* Blogs Grid */}
                <div className="max-w-7xl mx-auto px-6">
                    {filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    onClick={handleCardClick}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No blog posts found</h3>
                            <p className="text-gray-500 mt-1">Check back later for new content.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            <AddBlogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddBlog}
            />
        </div>
    );
};

export default BlogsPage;
