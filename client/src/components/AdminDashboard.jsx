import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import NewsForm from './admin/NewsForm';
import BlogForm from './admin/BlogForm';
import TableForm from './admin/TableForm';
import UpdateForm from './admin/UpdateForm';
import YouTubeForm from './admin/YouTubeForm';
import ContentManager from './admin/ContentManager';

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'news', name: 'News', icon: '📰' },
        { id: 'blogs', name: 'Blogs', icon: '📝' },
        { id: 'tables', name: 'Tables', icon: '📋' },
        { id: 'updates', name: 'Updates', icon: '🔔' },
        { id: 'youtube', name: 'YouTube', icon: '🎥' },
        { id: 'manage', name: 'Manage', icon: '⚙️' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView />;
            case 'news':
                return <NewsForm />;
            case 'blogs':
                return <BlogForm />;
            case 'tables':
                return <TableForm />;
            case 'updates':
                return <UpdateForm />;
            case 'youtube':
                return <YouTubeForm />;
            case 'manage':
                return <ContentManager />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="mt-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-xl mr-3">{tab.icon}</span>
                            <span className="font-medium">{tab.name}</span>
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <a
                            href="/?view=user"
                            // target="_blank" // Optional: open in new tab if preferred, but user didn't specify. Keeping in same tab is smoother for "viewing".
                            className="w-full flex items-center px-6 py-3 text-left transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        >
                            <span className="text-xl mr-3">👁️</span>
                            <span className="font-medium">User View</span>
                        </a>
                    </div>
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                                {user?.firstName?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800 capitalize">
                                {tabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                Welcome back, {user?.firstName}!
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )
            }
        </div >
    );
};

// Dashboard View Component
const DashboardView = () => {
    const { allNews, allBlogs, allTables, allUpdates, allYouTubeVideos } = useContext(AppContext);

    const stats = [
        {
            title: 'Total News',
            count: allNews.length,
            icon: '📰',
            color: 'bg-blue-500',
            change: '+12%'
        },
        {
            title: 'Blog Posts',
            count: allBlogs.length,
            icon: '📝',
            color: 'bg-green-500',
            change: '+8%'
        },
        {
            title: 'Data Tables',
            count: allTables.length,
            icon: '📋',
            color: 'bg-yellow-500',
            change: '+5%'
        },
        {
            title: 'Updates',
            count: allUpdates.length,
            icon: '🔔',
            color: 'bg-purple-500',
            change: '+15%'
        },
        {
            title: 'YouTube Videos',
            count: allYouTubeVideos.length,
            icon: '🎥',
            color: 'bg-red-500',
            change: '+20%'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
                        <p className="text-blue-100 text-lg">
                            Manage your content and engage with your audience effectively
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-4xl">🚀</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">📰</span>
                            <h4 className="font-medium text-gray-900">Add News</h4>
                        </div>
                        <p className="text-sm text-gray-600">Share latest news and updates</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors duration-200">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">🎥</span>
                            <h4 className="font-medium text-gray-900">Add Video</h4>
                        </div>
                        <p className="text-sm text-gray-600">Upload YouTube video links</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors duration-200">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">📝</span>
                            <h4 className="font-medium text-gray-900">Write Blog</h4>
                        </div>
                        <p className="text-sm text-gray-600">Create detailed blog posts</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {allNews.slice(0, 3).map((news, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 text-sm">📰</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{news.title}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(news.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

