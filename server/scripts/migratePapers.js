import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PreviousPaper from '../models/previousPaperModel.js';
import PDF from '../models/pdfModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Loading env from:', path.join(__dirname, '../.env'));
dotenv.config({ path: path.join(__dirname, '../.env') });
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Defined' : 'Undefined');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const migrate = async () => {
    await connectDB();

    try {
        const papers = await PreviousPaper.find({});
        console.log(`Found ${papers.length} Previous Papers to migrate.`);

        let migratedCount = 0;

        for (const paper of papers) {
            // Map fields
            const newPdf = new PDF({
                title: paper.title,
                description: `Previous Year Paper for ${paper.examName} (${paper.year}) - ${paper.paperType}. Category: ${paper.category}. Difficulty: ${paper.difficulty}`,
                category: 'solved-papers', // Defaulting to solved-papers as it fits best
                subject: paper.subject,
                fileUrl: paper.fileUrl,
                fileName: paper.fileName,
                fileData: paper.fileData,
                contentType: paper.contentType,
                fileSize: paper.fileSize || 0,
                pages: paper.pages,
                tags: paper.tags || [paper.examName, paper.year.toString(), paper.category],
                isPaid: paper.isPaid,
                price: paper.price,
                downloadCount: paper.downloadCount,
                isPublished: paper.isPublished,
                author: paper.uploadedBy || 'Admin'
            });

            await newPdf.save();
            migratedCount++;
            console.log(`Migrated: ${paper.title}`);
        }

        console.log(`Successfully migrated ${migratedCount} papers.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
