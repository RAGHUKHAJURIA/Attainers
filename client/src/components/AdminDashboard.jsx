import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
// import NewsForm from './admin/NewsForm';
import BlogForm from './admin/BlogForm';
import TableForm from './admin/TableForm';
import UpdateForm from './admin/UpdateForm';
import YouTubeForm from './admin/YouTubeForm';
import MockTestManager from './admin/MockTestManager';

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Navigation Structure matching User Home logic + Admin specific forms
    const navItems = [
        {
            category: 'Overview',
            items: [
                {
                    id: 'dashboard', name: 'Dashboard', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    )
                },
            ]
        },
        {
            category: 'Content Entry',
            items: [
                {
                    id: 'updates', name: 'Latest Updates', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" /></svg>
                    )
                },
                {
                    id: 'blogs', name: 'Blogs', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    )
                },
                {
                    id: 'youtube', name: 'YouTube', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )
                },
            ]
        },
        {
            category: 'Exams & Tests',
            items: [
                {
                    id: 'mock-tests', name: 'Mock Tests', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    )
                },
                {
                    id: 'tables', name: 'Tables / Schedules', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )
                },
            ]
        }
    ];

    const directManageLinks = [
        { name: 'Manage PDFs', path: '/pdfs', icon: '📄' },
        { name: 'Manage Courses', path: '/courses', icon: '🎓' },
        { name: 'Manage Papers', path: '/previous-papers', icon: '📝' },
        { name: 'Manage Tests', path: '/mock-tests', icon: '✍️' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
            case 'news': return <UpdateForm />; // Map news to UpdateForm if clicked via quick actions or legacy
            case 'updates': return <UpdateForm />;
            case 'blogs': return <BlogForm />;
            case 'tables': return <TableForm />;
            case 'youtube': return <YouTubeForm />;
            case 'mock-tests': return <MockTestManager />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow-lg mr-3" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                        Admin Panel
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    {navItems.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {group.category}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === item.id
                                            ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className={`mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {item.icon}
                                        </span>
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quick Access Links */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Manage on Site
                        </h3>
                        <div className="space-y-1">
                            {directManageLinks.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(link.path)}
                                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="mr-3 opacity-70 group-hover:opacity-100">{link.icon}</span>
                                    {link.name}
                                    <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/25 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {navItems.flatMap(g => g.items).find(i => i.id === activeTab)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/?view=user')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <span>View Site</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Dashboard Stats View
const DashboardView = ({ onNavigate }) => {
    const { allNews, allBlogs, allTables, allUpdates, allYouTubeVideos } = useContext(AppContext);

    const stats = [
        { label: 'News Items', value: allNews.length, color: 'blue', icon: '📰' },
        { label: 'Blog Posts', value: allBlogs.length, color: 'green', icon: '📝' },
        { label: 'Data Tables', value: allTables.length, color: 'yellow', icon: '📊' },
        { label: 'Updates', value: allUpdates.length, color: 'purple', icon: '🔔' },
        { label: 'Videos', value: allYouTubeVideos.length, color: 'red', icon: '🎥' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Application */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Manage your website's content, track performance, and keep your users updated—all from one place.
                    </p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Actions Grid */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create Blog */}
                <button
                    onClick={() => onNavigate('blogs')}
                    className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Write a Blog Post</h3>
                    <p className="text-sm text-gray-500">Create engaging content for your students.</p>
                </button>

                {/* Add Video */}
                <button
                    onClick={() => onNavigate('youtube')}
                    className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Add YouTube Video</h3>
                    <p className="text-sm text-gray-500">Share educational videos from your channel.</p>
                </button>

                {/* Post Update */}
                <button
                    onClick={() => onNavigate('updates')}
                    className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Post New Update</h3>
                    <p className="text-sm text-gray-500">Announce important news or alerts.</p>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;

