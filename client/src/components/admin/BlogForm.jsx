import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const BlogForm = () => {
    const { createContent } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'study-material',
        tags: '',
        featuredImage: '',
        author: 'Admin'
    });
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { value: 'study-material', label: 'Study Material' },
        { value: 'career-guidance', label: 'Career Guidance' },
        { value: 'government-jobs', label: 'Government Jobs' },
        { value: 'exam-updates', label: 'Exam Updates' },
        { value: 'general', label: 'General' }
    ];

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFile(files[0]);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('excerpt', formData.excerpt);
        data.append('category', formData.category);
        data.append('tags', formData.tags); // server expects array but FormData sends string, backend should parse if needed or we split here?
        // Wait, typical FormData sends string. Backend blog.js might expect array.
        // Let's check blog.js. If it expects array, we might need to send multiple 'tags' keys or JSON stringify.
        // But previously it sent an object with array.
        // Let's check blog.js controller.
        data.append('author', formData.author);
        if (file) {
            data.append('file', file);
        }
        // Fallback or explicit URL if no file? Controller handles req.file priority.
        if (formData.featuredImage) {
            data.append('featuredImage', formData.featuredImage);
        }

        // Tags handling: FormData sends string. If backend expects array, we might need to change backend or send multiple fields.
        // Let's assume for now I will rely on backend to handle it or just stringify it?
        // Actually, if I look at UpdateForm, I used FormData.

        // I'll check blog.js.
        // For now let's apply this change partially or check blog.js first.
        // I will just prepare the structure.

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagsArray.forEach(tag => data.append('tags[]', tag)); // standard way for arrays
        // OR
        // data.append('tags', JSON.stringify(tagsArray)); // if backend parses JSON

        // Let's check blog.js controller to be safe. I will pause this edit and check blog.js first.

        // ABORTING EDIT TO CHECK CONTROLLER.
        // Check if createContent is available
        if (createContent) {
            const result = await createContent('blogs', data);
            if (result) {
                // Reset logic here if successful, or defer to result check
                setFormData({
                    title: '',
                    content: '',
                    excerpt: '',
                    category: 'study-material',
                    tags: '',
                    featuredImage: '',
                    author: 'Admin'
                });
                setFile(null);
                const fileInput = document.getElementById('file');
                if (fileInput) fileInput.value = '';
            }
        } else {
            console.error("createContent function is missing from context");
        }

        setIsLoading(false);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            category: 'study-material',
            tags: '',

            featuredImage: '',
            author: 'Admin'
        });
        setFile(null);
        // Reset file input if exists
        const fileInput = document.getElementById('file');
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create Blog Post</h2>
                            <p className="text-green-100">Write detailed articles and study guides</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Blog Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title for your blog post..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.title.length}
                        </p>
                    </div>

                    {/* Excerpt Field */}
                    <div className="space-y-2">
                        <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700">
                            Blog Excerpt <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Write a brief summary of your blog post..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.excerpt.length}
                        </p>
                    </div>

                    {/* Category and Tags Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700">
                                Tags <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="tag1, tag2, tag3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            />
                            <p className="text-xs text-gray-500">
                                Separate tags with commas
                            </p>
                        </div>
                    </div>

                    {/* Content Field */}
                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
                            Blog Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your detailed blog content here..."
                            rows="12"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-vertical"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Character count: {formData.content.length}
                        </p>
                    </div>

                    {/* Featured Image and Author Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="featuredImage" className="block text-sm font-semibold text-gray-700">
                                Featured Image
                            </label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="url"
                                    id="featuredImage"
                                    name="featuredImage"
                                    value={formData.featuredImage}
                                    onChange={handleChange}
                                    disabled={!!file}
                                    placeholder="Image URL (https://...)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400"
                                />
                                <div className="text-center text-xs text-gray-400 font-medium">- OR -</div>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="author" className="block text-sm font-semibold text-gray-700">
                                Author
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Author name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Publish Blog
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-gray-300 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Form
                        </button>
                    </div>
                </form>

                {/* Tips Section */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Blog Writing Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Structure:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Start with a compelling introduction</li>
                                <li>• Use headings and subheadings</li>
                                <li>• Include examples and case studies</li>
                                <li>• End with a clear conclusion</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">SEO Tips:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use relevant keywords naturally</li>
                                <li>• Write descriptive meta descriptions</li>
                                <li>• Include internal and external links</li>
                                <li>• Optimize images with alt text</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogForm;

