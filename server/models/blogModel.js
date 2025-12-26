import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['study-material', 'career-guidance', 'government-jobs', 'exam-updates', 'general']
    },
    tags: [{
        type: String
    }],
    featuredImage: {
        type: String
    },
    author: {
        type: String,
        default: 'Admin'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

