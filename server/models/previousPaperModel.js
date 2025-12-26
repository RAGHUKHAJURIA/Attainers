import mongoose from "mongoose";

const previousPaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['upsc', 'ssc', 'banking', 'railway', 'defense', 'state-psc', 'other']
    },
    paperType: {
        type: String,
        required: true,
        enum: ['prelims', 'mains', 'interview', 'written', 'objective', 'subjective']
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
    totalMarks: {
        type: Number
    },
    duration: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{
        type: String
    }],
    downloadCount: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    uploadedBy: {
        type: String,
        default: 'Admin'
    }
}, { timestamps: true });

const PreviousPaper = mongoose.model("PreviousPaper", previousPaperSchema);

export default PreviousPaper;

