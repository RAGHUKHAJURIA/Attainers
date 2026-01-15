import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'support', 'complaint', 'suggestion', 'other'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'read', 'resolved'],
        default: 'new'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
