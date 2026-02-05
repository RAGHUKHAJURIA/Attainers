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
    testType: {
        type: String,
        enum: ['mock-test', 'pyq', 'current-affairs', 'subject-wise', 'exam-wise'],
        default: 'mock-test'
    },
    year: {
        type: Number,
        required: function () {
            return this.testType === 'pyq' || this.testType === 'current-affairs';
        }
    },
    subject: {
        type: String,
        required: function () {
            return this.testType === 'subject-wise';
        }
    },
    isPlaceholder: {
        type: Boolean,
        default: false
    },
    month: {
        type: String, // e.g., "January", "February"
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        required: false
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
    negativeMarks: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    questions: [questionSchema], // Embedded questions
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MockTest = mongoose.model('MockTest', mockTestSchema);

export default MockTest;
