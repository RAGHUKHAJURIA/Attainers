import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '@clerk/clerk-react';

const FeedbackManager = () => {
    const { backendUrl } = useContext(AppContext);
    const { getToken } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, new, read, resolved

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/feedback`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/feedback/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                if (selectedFeedback?._id === id) {
                    setShowDetailModal(false);
                    setSelectedFeedback(null);
                }
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = await getToken();
            const response = await fetch(`${backendUrl}/api/admin/feedback/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status, isRead: true })
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbacks(feedbacks.map(f => f._id === id ? data.data : f));
                if (selectedFeedback?._id === id) {
                    setSelectedFeedback(data.data);
                }
            }
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    const viewDetails = async (feedback) => {
        setSelectedFeedback(feedback);
        setShowDetailModal(true);

        // Mark as read
        if (!feedback.isRead) {
            handleStatusUpdate(feedback._id, 'read');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700 border-blue-200',
            read: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            resolved: 'bg-green-100 text-green-700 border-green-200'
        };
        return styles[status] || styles.new;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            general: '💬',
            support: '🛠️',
            complaint: '⚠️',
            suggestion: '💡',
            other: '📌'
        };
        return icons[category] || '📌';
    };

    const filteredFeedbacks = filter === 'all'
        ? feedbacks
        : feedbacks.filter(f => f.status === filter);

    const stats = {
        total: feedbacks.length,
        new: feedbacks.filter(f => f.status === 'new').length,
        read: feedbacks.filter(f => f.status === 'read').length,
        resolved: feedbacks.filter(f => f.status === 'resolved').length
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-500">Total Feedback</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{stats.new}</div>
                    <div className="text-sm text-blue-600">New</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 shadow-sm">
                    <div className="text-2xl font-bold text-yellow-700">{stats.read}</div>
                    <div className="text-sm text-yellow-600">Read</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
                    <div className="text-sm text-green-600">Resolved</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {['all', 'new', 'read', 'resolved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${filter === status
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {status} {status !== 'all' && `(${stats[status]})`}
                    </button>
                ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <div className="text-gray-400 text-5xl mb-4">📭</div>
                        <p className="text-gray-500">No feedback found</p>
                    </div>
                ) : (
                    filteredFeedbacks.map(feedback => (
                        <div
                            key={feedback._id}
                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{getCategoryIcon(feedback.category)}</span>
                                        <h3 className="font-bold text-lg text-gray-900">{feedback.subject}</h3>
                                        {!feedback.isRead && (
                                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {feedback.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {feedback.email}
                                        </span>
                                        {feedback.phone && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {feedback.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(feedback.status)}`}>
                                    {feedback.status}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-4 line-clamp-2">{feedback.message}</p>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => viewDetails(feedback)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                    {feedback.status !== 'resolved' && (
                                        <button
                                            onClick={() => handleStatusUpdate(feedback._id, 'resolved')}
                                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(feedback._id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{getCategoryIcon(selectedFeedback.category)}</span>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedFeedback.subject}</h2>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedFeedback.status)}`}>
                                    {selectedFeedback.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium text-gray-900">{selectedFeedback.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${selectedFeedback.email}`} className="text-blue-600 hover:underline">
                                        {selectedFeedback.email}
                                    </a>
                                </div>
                                {selectedFeedback.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <a href={`tel:${selectedFeedback.phone}`} className="text-blue-600 hover:underline">
                                            {selectedFeedback.phone}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="text-gray-600 capitalize">{selectedFeedback.category}</span>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedFeedback.message}</p>
                            </div>

                            {/* Timestamp */}
                            <div className="text-xs text-gray-400">
                                Submitted on {new Date(selectedFeedback.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                {selectedFeedback.status !== 'resolved' && (
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedFeedback._id, 'resolved');
                                            setShowDetailModal(false);
                                        }}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleDelete(selectedFeedback._id);
                                    }}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Delete Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackManager;
