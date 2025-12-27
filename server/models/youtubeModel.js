import mongoose from "mongoose";

const youtubeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    category: {
        type: String,
        required: true,
        enum: ['tutorial', 'exam-guidance', 'current-affairs', 'motivation', 'general']
    },
    tags: [{
        type: String
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const YouTube = mongoose.model("YouTube", youtubeSchema);

export default YouTube;

