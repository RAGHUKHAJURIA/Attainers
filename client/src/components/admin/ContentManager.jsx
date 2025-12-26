import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ContentManager = () => {
    const { allNews, allBlogs, allTables, allUpdates, allYouTubeVideos } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('news');
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'news', name: 'News', count: allNews.length, icon: '📰' },
        { id: 'blogs', name: 'Blogs', count: allBlogs.length, icon: '📝' },
        { id: 'tables', name: 'Tables', count: allTables.length, icon: '📋' },
        { id: 'updates', name: 'Updates', count: allUpdates.length, icon: '🔔' },
        { id: 'youtube', name: 'YouTube', count: allYouTubeVideos.length, icon: '🎥' }
    ];

    const getFilteredContent = () => {
        let content = [];
        switch (activeTab) {
            case 'news':
                content = allNews;
                break;
            case 'blogs':
                content = allBlogs;
                break;
            case 'tables':
                content = allTables;
                break;
            case 'updates':
                content = allUpdates;
                break;
            case 'youtube':
                content = allYouTubeVideos;
                break;
            default:
                content = [];
        }

        if (searchTerm) {
            content = content.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return content;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderContentItem = (item, type) => {
        const baseClasses = "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200";

        switch (type) {
            case 'news':
                return (
                    <div key={item._id} className={baseClasses}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span>📅 {formatDate(item.createdAt)}</span>
                                    {item.newsUrl && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>🔗 Source Available</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'blogs':
                return (
                    <div key={item._id} className={baseClasses}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                        {item.category}
                                    </span>
                                    {item.isPublished ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Published</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Draft</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span>👤 {item.author}</span>
                                    <span className="mx-2">•</span>
                                    <span>👁️ {item.views} views</span>
                                    <span className="mx-2">•</span>
                                    <span>📅 {formatDate(item.createdAt)}</span>
                                </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'tables':
                return (
                    <div key={item._id} className={baseClasses}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                        {item.category}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span>📊 {item.data.length} rows</span>
                                    <span className="mx-2">•</span>
                                    <span>📅 {formatDate(item.createdAt)}</span>
                                    {item.source && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>🔗 Source: {item.source}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'updates':
                return (
                    <div key={item._id} className={baseClasses}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs ${item.type === 'urgent' ? 'bg-red-100 text-red-700' :
                                            item.type === 'important' ? 'bg-orange-100 text-orange-700' :
                                                item.type === 'maintenance' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {item.type}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                        Priority: {item.priority}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                    <span>📅 {formatDate(item.createdAt)}</span>
                                    {item.expiryDate && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>⏰ Expires: {formatDate(item.expiryDate)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'youtube':
                return (
                    <div key={item._id} className={baseClasses}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                        {item.category}
                                    </span>
                                    {item.isFeatured && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <img
                                        src={item.thumbnail}
                                        alt="Video thumbnail"
                                        className="w-20 h-14 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span>👁️ {item.views} views</span>
                                            <span className="mx-2">•</span>
                                            <span>📅 {formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                                    Edit
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const filteredContent = getFilteredContent();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
                        <p className="text-gray-600">Manage all your content in one place</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name} ({tab.count})
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {filteredContent.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms' : 'Start by creating some content'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredContent.map((item) => renderContentItem(item, activeTab))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentManager;

