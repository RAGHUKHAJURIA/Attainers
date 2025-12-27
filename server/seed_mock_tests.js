
import MockTest from './models/mockTestModel.js';
import connectDB from './configs/mongodb.js';
import 'dotenv/config';

// Initial sample data
const initialTests = [
    {
        title: 'JKSSB SI Full Mock Test 1',
        examName: 'JKSSB SI',
        totalQuestions: 120,
        duration: 120,
        difficulty: 'Hard',
        description: 'Comprehensive mock test for JKSSB Sub-Inspector exam covering all sections.',
        questions: []
    },
    {
        title: 'SSC CGL Tier 1 Mock',
        examName: 'SSC CGL',
        totalQuestions: 100,
        duration: 60,
        difficulty: 'Medium',
        description: 'Practice set for SSC CGL Tier 1 exam pattern.',
        questions: []
    },
    {
        title: 'Junior Assistant Type Test',
        examName: 'JKSSB Junior Assistant',
        totalQuestions: 80,
        duration: 80,
        difficulty: 'Easy',
        description: 'Mock test focusing on Junior Assistant syllabus.',
        questions: []
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected to MongoDB');

        // Check if data already exists
        const count = await MockTest.countDocuments();
        if (count > 0) {
            console.log(`Database already has ${count} mock tests. Skipping seed.`);
            process.exit(0);
        }

        await MockTest.insertMany(initialTests);
        console.log('Mock tests seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
};

seedDB();
