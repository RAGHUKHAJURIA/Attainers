import React, { useState } from 'react';

const AddYouTubeModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        category: 'tutorial',
        tags: '',
        isFeatured: false
    });
    const [previewData, setPreviewData] = useState(null);

    const categories = [
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'exam-guidance', label: 'Exam Guidance' },
        { value: 'current-affairs', label: 'Current Affairs' },
        { value: 'motivation', label: 'Motivation' },
        { value: 'general', label: 'General' }
    ];

    if (!isOpen) return null;

    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        const videoId = extractVideoId(url);

        setFormData(prev => ({ ...prev, videoUrl: url }));

        if (videoId) {
            setPreviewData({
                videoId,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            });
        } else {
            setPreviewData(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const videoId = extractVideoId(formData.videoUrl);
        if (!videoId) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        // Convert tags string to array
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const videoData = {
            ...formData,
            tags: tagsArray
        };

        onAdd(videoData);
        setFormData({
            title: '',
            description: '',
            videoUrl: '',
            category: 'tutorial',
            tags: '',
            isFeatured: false
        });
        setPreviewData(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add YouTube Video</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                                <input
                                    type="url"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={formData.videoUrl}
                                    onChange={handleUrlChange}
                                />
                            </div>

                            {/* Preview Section */}
                            {previewData && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex gap-3">
                                        <img
                                            src={previewData.thumbnail}
                                            alt="Thumbnail"
                                            className="w-24 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 text-xs text-gray-500">
                                            <p>Video ID: {previewData.videoId}</p>
                                            <p className="text-green-600">Thumbnail valid</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="Video Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className="modern-select mt-1"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="modern-input mt-1 w-full"
                                    placeholder="Brief description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    className="modern-input mt-1"
                                    placeholder="tag1, tag2"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Feature this video</label>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                                >
                                    Add Video
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddYouTubeModal;
