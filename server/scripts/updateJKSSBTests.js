
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

const updateTests = async () => {
    await connectDB();

    try {
        const tests = await MockTest.find({
            title: { $regex: /JKSSB Junior/i }
        });

        console.log(`Found ${tests.length} tests to update:`);

        for (const test of tests) {
            console.log(`Updating: ${test.title} (${test._id})`);
            console.log(`  Old Type: ${test.testType}, Old Exam: ${test.examName}`);

            test.testType = 'exam-wise';
            test.examName = 'JKSSB';
            // Ensure not a placeholder
            test.isPlaceholder = false;

            await test.save();
            console.log(`  New Type: ${test.testType}, New Exam: ${test.examName}`);
            console.log('---');
        }

        console.log('Update complete.');

    } catch (error) {
        console.error('Error updating tests:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateTests();
