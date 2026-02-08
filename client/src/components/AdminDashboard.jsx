import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
// import NewsForm from './admin/NewsForm';
import BlogForm from './admin/BlogForm';
import TableForm from './admin/TableForm';
import UpdateForm from './admin/UpdateForm';
import YouTubeForm from './admin/YouTubeForm';
import MockTestManager from './admin/MockTestManager';
import PYQTestManager from './admin/PYQTestManager';
import FeedbackManager from './admin/FeedbackManager';
import CurrentAffairsTestManager from './admin/CurrentAffairsTestManager';
import ExamWiseTestManager from './admin/ExamWiseTestManager';
import SubjectWiseTestManager from './admin/SubjectWiseTestManager';

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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                    )
                },
                {
                    id: 'blogs', name: 'Blogs', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    )
                },
                {
                    id: 'youtube', name: 'YouTube', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )
                },
            ]
        },
        {
            category: 'Mock Tests',
            items: [
                {
                    id: 'current-affairs-tests', name: 'J & K Current Affairs', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    )
                },
                {
                    id: 'exam-wise-tests', name: 'Exam-Wise Tests', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )
                },
                {
                    id: 'subject-wise-tests', name: 'Subject-Wise Tests', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    )
                },
                // General Mock Tests removed as per cleanup request
                {
                    id: 'pyq-tests', name: 'PYQ Tests', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )
                },
            ]
        },
        {
            category: 'Other',
            items: [
                {
                    id: 'tables', name: 'Tables / Schedules', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )
                },
            ]
        },
        {
            category: 'User Engagement',
            items: [
                {
                    id: 'feedback', name: 'Feedback', icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    )
                },
            ]
        }
    ];

    const directManageLinks = [
        { name: 'Manage PDFs', path: '/pdfs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { name: 'Manage Courses', path: '/courses', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg> },
        { name: 'Manage Papers', path: '/previous-papers', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
        { name: 'Manage Tests', path: '/mock-tests', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
            case 'news': return <UpdateForm />;
            case 'updates': return <UpdateForm />;
            case 'blogs': return <BlogForm />;
            case 'tables': return <TableForm />;
            case 'youtube': return <YouTubeForm />;
            case 'current-affairs-tests': return <CurrentAffairsTestManager />;
            case 'exam-wise-tests': return <ExamWiseTestManager />;
            case 'subject-wise-tests': return <SubjectWiseTestManager />;
            case 'mock-tests': return <MockTestManager />;
            case 'pyq-tests': return <PYQTestManager />;
            case 'feedback': return <FeedbackManager />;
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
                <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                            {navItems.flatMap(g => g.items).find(i => i.id === activeTab)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => navigate('/?view=user')}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <span className="hidden sm:inline">View Site</span>
                            <span className="sm:hidden">Site</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
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
            {/* Welcome Banner Removed */}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions Removed */}
        </div>
    );
};

export default AdminDashboard;

