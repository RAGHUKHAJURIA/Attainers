import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['study-material', 'syllabus', 'notes', 'reference-books', 'question-banks', 'solved-papers']
    },
    subject: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    pages: {
        type: Number
    },
    tags: [{
        type: String
    }],
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    author: {
        type: String,
        default: 'Admin'
    }
}, { timestamps: true });

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;

