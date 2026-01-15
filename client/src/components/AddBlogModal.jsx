import React, { useState } from 'react';

const AddBlogModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'study-material',
        featuredImage: '',

        file: null, // For upload
        tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Split tags by comma and trim
        const processedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        if (formData.file) {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('category', formData.category);
            data.append('tags', processedTags.join(',')); // API expects string or array handling
            data.append('file', formData.file); // 'file' field name matches adminRoute 'upload.single("file")'
            // featuredImage URL if provided as fallback? Logic in backend handles req.file priority.
            // If we want to support URL when file is null, we append it.
            if (formData.featuredImage) data.append('featuredImage', formData.featuredImage);

            onAdd(data);
        } else {
            // Standard JSON behavior if no file
            const finalData = {
                ...formData,
                tags: processedTags,
                author: 'Admin', // Default to Admin for now
                views: 0
            };
            onAdd(finalData);
        }
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'study-material',
            featuredImage: '',
            tags: ''
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Blog Post</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="Enter blog title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="study-material">Study Material</option>
                                        <option value="career-guidance">Career Guidance</option>
                                        <option value="government-jobs">Government Jobs</option>
                                        <option value="exam-updates">Exam Updates</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Detailed Image</label>
                                    <div className="flex flex-col gap-2 mt-1">
                                        <input
                                            type="url"
                                            className="modern-input"
                                            placeholder="Image URL (https://...)"
                                            value={formData.featuredImage}
                                            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value, file: null })}
                                            disabled={!!formData.file}
                                        />
                                        <div className="text-center text-xs text-gray-400">- OR -</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="text-sm text-gray-500"
                                            onChange={(e) => setFormData({ ...formData, file: e.target.files[0], featuredImage: '' })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Excerpt (Short Summary)</label>
                                <textarea
                                    required
                                    rows="2"
                                    className="modern-input mt-1 w-full"
                                    placeholder="Brief description for the card..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    required
                                    rows="8"
                                    className="modern-input mt-1 w-full font-mono text-sm"
                                    placeholder="Write your blog content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Basic text format for now.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    className="modern-input mt-1"
                                    placeholder="e.g. math, exam, tips"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                >
                                    Publish Blog
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

export default AddBlogModal;
