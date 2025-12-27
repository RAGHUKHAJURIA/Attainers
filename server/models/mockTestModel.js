import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false }
    }],
    explanation: {
        type: String,
        default: ''
    },
    marks: {
        type: Number,
        default: 1
    }
});

const mockTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    questions: [questionSchema], // Embedded questions
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MockTest = mongoose.model('MockTest', mockTestSchema);

export default MockTest;
