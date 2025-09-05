import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const ALLNews = () => {
  const { fetchAllNews, allNews = [] } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const newsPerPage = 6; // Show 6 news items per page

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      await fetchAllNews();
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Small delay for smooth loading animation
    };
    loadNews();
  }, []);

  // Sort news by creation date (newest first)
  const sortedNews = [...allNews].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = sortedNews.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setAnimationKey(prev => prev + 1);
      setCurrentPage(newPage);
    }
  };

  const handleReadMore = (newsUrl, title) => {
    if (newsUrl) {
      window.open(newsUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`No external link available for "${title}"`);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const newsDate = new Date(dateString);
    const diffInHours = Math.floor((now - newsDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return newsDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Animation */}
      <div className="bg-white border-b-4 border-blue-800 transform transition-all duration-1000 ease-out">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center transform transition-all duration-1000 delay-300 ease-out">
            <h1 className="text-4xl font-bold text-blue-900 mb-3 animate-fade-in">
              Latest News & Updates
            </h1>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Official news and announcements from the government portal
            </p>
            <div className="w-32 h-1 bg-blue-800 mx-auto mt-6 transform scale-x-0 animate-expand-width"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-pulse">
              <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg animate-pulse">Loading latest news updates...</p>
          </div>
        ) : sortedNews.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-6 transform transition-transform duration-500 hover:scale-110">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Available</h3>
            <p className="text-gray-600">Please check back later for updates.</p>
          </div>
        ) : (
          <>
            {/* News Grid with Staggered Animation */}
            <div key={animationKey} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentNews.map((news, index) => (
                <article 
                  key={news._id || index} 
                  className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-slide-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="p-6">
                    {/* News Header with Animation */}
                    <div className="flex items-center justify-between mb-4 transform transition-transform duration-300">
                      <span className="inline-block bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded transform transition-transform duration-300 hover:scale-105">
                        NEWS #{String(startIndex + index + 1).padStart(3, '0')}
                      </span>
                      <div className="flex flex-col items-end">
                        {news.createdAt && (
                          <>
                            <span className="text-xs text-green-600 font-semibold">
                              {getTimeAgo(news.createdAt)}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {new Date(news.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title with Hover Effect */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight transform transition-colors duration-300 hover:text-blue-800 cursor-pointer">
                      {news.title}
                    </h2>
                    
                    {/* Content Preview */}
                    {news.content && (
                      <p className="text-gray-700 mb-6 leading-relaxed text-sm transform transition-all duration-300 hover:text-gray-900">
                        {news.content.length > 150 
                          ? `${news.content.substring(0, 150)}...` 
                          : news.content
                        }
                      </p>
                    )}

                    {/* Read More Button with Enhanced Animation */}
                    <div className="border-t border-gray-200 pt-4">
                      <button 
                        onClick={() => handleReadMore(news.newsUrl, news.title)}
                        className="group w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {news.newsUrl ? 'Read Full Article' : 'View Details'}
                          <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Enhanced Pagination with Smooth Transitions */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center space-y-6 animate-fade-in">
                <div className="flex items-center space-x-4">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-blue-800 bg-white border border-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-110 ${
                            currentPage === page
                              ? 'bg-blue-800 text-white shadow-lg'
                              : 'bg-white text-blue-800 border border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-blue-800 bg-white border border-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    Next
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Page Info */}
                <div className="bg-white border border-gray-300 rounded-lg px-6 py-3 transform transition-all duration-300 hover:shadow-md">
                  <p className="text-gray-600 font-medium text-sm">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedNews.length)} of{' '}
                    <span className="text-blue-800 font-bold">{sortedNews.length}</span> news articles
                    {sortedNews.length > 0 && (
                      <span className="ml-2 text-green-600">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expand-width {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-expand-width {
          animation: expand-width 0.8s ease-out 0.5s forwards;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ALLNews;