import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['government-exams', 'competitive-exams', 'academic', 'skill-development', 'language', 'certification']
    },
    subject: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    playlistId: {
        type: String
    },
    isYouTube: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number
    },
    discount: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        required: true
    },
    videoCount: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    features: [{
        type: String
    }],
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;

