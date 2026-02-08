
import mongoose from 'mongoose';
import MockTest from '../models/mockTestModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually configure dotenv because we are running this script directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const findTests = async () => {
    await connectDB();

    try {
        const tests = await MockTest.find({
            examName: { $regex: /JKSSB/i },
            isPlaceholder: true
        });

        console.log(`Found ${tests.length} tests:`);
        tests.forEach(test => {
            console.log(`ID: ${test._id}`);
            console.log(`Title: ${test.title}`);
            console.log(`ExamName: ${test.examName}`);
            console.log(`TestType: ${test.testType}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error finding tests:', error);
    } finally {
        mongoose.connection.close();
    }
};

findTests();
