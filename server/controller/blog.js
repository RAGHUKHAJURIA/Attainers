import Blog from "../models/blogModel.js";
import fs from 'fs';
import path from 'path';

const fixUrl = (url, req) => {
    if (!url) return url;
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
        return url.replace(/http:\/\/localhost:\d+/, baseUrl).replace(/http:\/\/127\.0\.0\.1:\d+/, baseUrl);
    }
    return url;
};

export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, featuredImage, author } = req.body;
        let finalFeaturedImage = featuredImage;

        if (req.file) {
            const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            finalFeaturedImage = `${baseUrl}/uploads/${req.file.filename}`;
        }

        // Handle tags if they come as string (FormData)
        let finalTags = tags;
        if (typeof tags === 'string') {
            finalTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        const blog = new Blog({
            title,
            content,
            excerpt,
            category,
            tags: finalTags || [],
            featuredImage: finalFeaturedImage,
            author: author || 'Admin',
            isPublished: true
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
            blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const sanitizedBlogs = blogs.map(b => {
            const blogObj = b.toObject();
            blogObj.featuredImage = fixUrl(blogObj.featuredImage, req);
            return blogObj;
        });



        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            blogs: sanitizedBlogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            blog: {
                ...blog.toObject(),
                featuredImage: fixUrl(blog.featuredImage, req)
            }
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            updateData.featuredImage = `${baseUrl}/uploads/${req.file.filename}`;
        }

        // Handle tags if they come as string (FormData)
        if (typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            blog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Delete associated file
        if (blog.featuredImage && blog.featuredImage.includes('/uploads/')) {
            try {
                const filename = blog.featuredImage.split('/uploads/')[1];
                if (filename) {
                    const filePath = path.join(process.cwd(), 'uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (err) {
                console.error("Error deleting image file:", err);
            }
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

