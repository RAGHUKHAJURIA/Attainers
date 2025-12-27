import React, { useState } from 'react';

const AddCourseModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        category: 'academic',
        subject: 'General',
        instructor: 'Admin',
        level: 'beginner',
        thumbnail: '',
        playlistUrl: '',
        isFeatured: false
    });

    if (!isOpen) return null;

    const extractIds = (url) => {
        let playlistId = null;
        let videoId = null;

        if (!url) return { playlistId, videoId };

        // Robust Video ID Regex - supports v=, embed/, youtu.be/, shorts/
        const vidReg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const vidMatch = vidReg.exec(url);
        if (vidMatch) videoId = vidMatch[1];

        // Playlist ID
        const listReg = /[&?]list=([^&]+)/i;
        const listMatch = listReg.exec(url);
        if (listMatch) playlistId = listMatch[1];

        return { playlistId, videoId };
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        const { playlistId, videoId } = extractIds(url);

        let newThumbnail = formData.thumbnail;
        if (videoId) {
            // Use hqdefault as it is most reliable.
            newThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        setFormData({
            ...formData,
            playlistUrl: url,
            thumbnail: newThumbnail
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { playlistId } = extractIds(formData.playlistUrl);

        const finalData = {
            ...formData,
            playlistId: playlistId,
            isYouTube: !!playlistId,
            price: 0,
            videoCount: 10, // Dummy default
            duration: 'Flexible',
            rating: 4.5,
            enrollmentCount: 0
        };

        if (!finalData.shortDescription) {
            finalData.shortDescription = finalData.description.substring(0, 100) + '...';
        }

        onAdd(finalData);
        setFormData({
            title: '',
            description: '',
            shortDescription: '',
            category: 'academic',
            subject: 'General',
            instructor: 'Admin',
            level: 'beginner',
            thumbnail: '',
            playlistUrl: '',
            isFeatured: false
        });
        onClose();
    };

    const { playlistId, videoId } = extractIds(formData.playlistUrl);
    const showPlaylistWarning = formData.playlistUrl && playlistId && !videoId;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Course / Playlist</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="e.g. Complete Python Bootcamp"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">YouTube Playlist URL</label>
                                <input
                                    type="url"
                                    required
                                    className="modern-input mt-1"
                                    placeholder="Paste link to a VIDEO inside the playlist"
                                    value={formData.playlistUrl}
                                    onChange={handleUrlChange}
                                />
                                {showPlaylistWarning && (
                                    <p className="text-xs text-amber-600 mt-1 font-medium">
                                        ⚠️ You pasted a playlist-only link. Please paste a link to a specific <b>video</b> in the playlist to generate a thumbnail.
                                    </p>
                                )}
                                {!showPlaylistWarning && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tip: Open a video from the playlist and copy that link. We'll use the video's thumbnail.
                                    </p>
                                )}
                            </div>

                            {/* Auto-populated Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thumbnail URL (Auto-generated)</label>
                                <input
                                    type="url"
                                    required
                                    className="modern-input mt-1 bg-gray-50"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                            </div>

                            {/* Thumbnail Preview */}
                            {formData.thumbnail && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Preview</label>
                                    <img
                                        src={formData.thumbnail}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="modern-input mt-1 w-full"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="academic">Academic</option>
                                        <option value="competitive-exams">Competitive Exams</option>
                                        <option value="government-exams">Government Exams</option>
                                        <option value="skill-development">Skill Development</option>
                                        <option value="language">Language</option>
                                        <option value="certification">Certification</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Level</label>
                                    <select
                                        className="modern-select mt-1"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                <label className="ml-2 block text-sm text-gray-900">Feature this course</label>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                >
                                    Add Course
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

export default AddCourseModal;
