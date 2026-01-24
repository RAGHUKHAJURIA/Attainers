import mongoose from 'mongoose';
import MockTest from './models/mockTestModel.js';

// MongoDB connection string
const connectionString = "mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/Attainers?retryWrites=true&w=majority";

// Dummy questions
const dummyQuestions = [
    {
        questionText: "What is the capital of India?",
        options: [
            { text: "Mumbai", isCorrect: false },
            { text: "New Delhi", isCorrect: true },
            { text: "Kolkata", isCorrect: false },
            { text: "Chennai", isCorrect: false }
        ],
        explanation: "New Delhi is the capital of India.",
        marks: 1
    },
    {
        questionText: "Who is known as the Father of the Nation in India?",
        options: [
            { text: "Jawaharlal Nehru", isCorrect: false },
            { text: "Mahatma Gandhi", isCorrect: true },
            { text: "Subhas Chandra Bose", isCorrect: false },
            { text: "Bhagat Singh", isCorrect: false }
        ],
        explanation: "Mahatma Gandhi is known as the Father of the Nation in India.",
        marks: 1
    },
    {
        questionText: "What is 15 + 27?",
        options: [
            { text: "40", isCorrect: false },
            { text: "42", isCorrect: true },
            { text: "44", isCorrect: false },
            { text: "46", isCorrect: false }
        ],
        explanation: "15 + 27 = 42",
        marks: 1
    }
];

async function addDummyTests() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        console.log('✅ Connected to MongoDB\n');

        // PYQ Test for 2025
        const pyq2025 = new MockTest({
            title: "JKSSB SI PYQ 2025 - Set 1",
            examName: "JKSSB SI",
            testType: "pyq",
            year: 2025,
            difficulty: "Medium",
            duration: 120,
            totalQuestions: 3,
            negativeMarks: 0.25,
            description: "Previous year questions from JKSSB SI 2025 examination. Practice with real exam questions.",
            questions: dummyQuestions
        });

        // PYQ Test for 2026
        const pyq2026 = new MockTest({
            title: "SSC CGL PYQ 2026 - Set 1",
            examName: "SSC CGL",
            testType: "pyq",
            year: 2026,
            difficulty: "Hard",
            duration: 90,
            totalQuestions: 3,
            negativeMarks: 0.5,
            description: "Previous year questions from SSC CGL 2026 examination. Comprehensive practice set.",
            questions: dummyQuestions
        });

        await pyq2025.save();
        console.log('✅ Added PYQ test for 2025:', pyq2025.title);

        await pyq2026.save();
        console.log('✅ Added PYQ test for 2026:', pyq2026.title);

        console.log('\n🎉 Successfully added dummy PYQ tests!');

        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding tests:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

addDummyTests();
