import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/public/blogs/${id}`);
                const data = await response.json();
                if (data.success) {
                    setBlog(data.blog);
                }
            } catch (error) {
                console.error("Error fetching blog details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        &larr; Return to Blogs
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero / Header */}
                <div className="max-w-4xl mx-auto px-6 mb-10">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                        <button
                            onClick={() => navigate('/blogs')}
                            className="hover:text-blue-600 transition-colors"
                        >
                            &larr; Back to Blogs
                        </button>
                        <span>•</span>
                        <span className="uppercase tracking-wider font-semibold text-blue-600">
                            {blog.category.replace(/-/g, ' ')}
                        </span>
                        <span>•</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {blog.author.charAt(0)}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{blog.author}</div>
                                <div className="text-xs text-gray-500">Author</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {blog.views} Reads
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <div className="max-w-5xl mx-auto px-4 mb-12">
                        <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <article className="max-w-3xl mx-auto px-6 prose prose-lg prose-blue">
                    <p className="lead text-xl text-gray-600 mb-8 italic border-l-4 border-blue-500 pl-4">
                        {blog.excerpt}
                    </p>

                    {/* Basic whitespace handling for text content */}
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {blog.content}
                    </div>
                </article>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="max-w-3xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetailPage;
