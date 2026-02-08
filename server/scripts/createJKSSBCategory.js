
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

const createCategory = async () => {
    await connectDB();

    try {
        // Check if exists one last time to be double sure
        const existing = await MockTest.findOne({
            examName: 'JKSSB',
            isPlaceholder: true,
            testType: 'exam-wise'
        });

        if (existing) {
            console.log('JKSSB category already exists.');
            return;
        }

        const newCategory = new MockTest({
            title: 'JKSSB',
            examName: 'JKSSB',
            testType: 'exam-wise',
            isPlaceholder: true,
            description: 'Mock tests for JKSSB exams',
            duration: 0,
            totalQuestions: 0,
            isPublished: true,
            year: new Date().getFullYear(),
            subject: 'General' // Dummy
        });

        await newCategory.save();
        console.log('Created JKSSB category placeholder.');

    } catch (error) {
        console.error('Error creating category:', error);
    } finally {
        mongoose.connection.close();
    }
};

createCategory();
