import mongoose from 'mongoose';
import 'dotenv/config';

// Import all models
import Blog from './models/blogModel.js';
import Course from './models/courseModel.js';
import News from './models/newsModel.js';
import PreviousPaper from './models/previousPaperModel.js';
import Table from './models/tableModel.js';
import Update from './models/updateModel.js';
import VideoLecture from './models/videoLectureModel.js';
import YouTube from './models/youtubeModel.js';
import PDF from './models/pdfModel.js';
import MockTest from './models/mockTestModel.js';

const OLD_PLACEHOLDER = "https://via.placeholder.com/600x400";
const NEW_PLACEHOLDER = "https://placehold.co/600x400";

const fixData = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/Attainers");
        console.log("Connected!");

        const models = [
            { name: 'Blog', model: Blog, fields: ['featuredImage'] },
            { name: 'Course', model: Course, fields: ['thumbnail'] },
            { name: 'VideoLecture', model: VideoLecture, fields: ['thumbnail'] },
            { name: 'YouTube', model: YouTube, fields: ['thumbnail'] },
            { name: 'PDF', model: PDF, fields: [] }, // No image but checking isPublished
            { name: 'News', model: News, fields: [] },
            { name: 'PreviousPaper', model: PreviousPaper, fields: [] },
            { name: 'Table', model: Table, fields: [] },
            { name: 'Update', model: Update, fields: ['image'] }, // Assuming updates have image field based on earlier reads, or double check model
        ];

        for (const { name, model, fields } of models) {
            console.log(`Fixing ${name}...`);

            // 1. Fix Images
            for (const field of fields) {
                const res = await model.updateMany(
                    { [field]: OLD_PLACEHOLDER },
                    { $set: { [field]: NEW_PLACEHOLDER } }
                );
                if (res.modifiedCount > 0) {
                    console.log(`  Updated ${res.modifiedCount} images in ${field}`);
                }
            }

            // 2. Ensure isPublished is true (except for explicit drafts if logic existed, but requested 'Publish Now' fix implies enable all)
            // Checking if model has isPublished field first?
            // Most models usually do.
            try {
                // Determine if schema has isPublished
                const schemaPaths = model.schema.paths;
                if (schemaPaths.isPublished) {
                    const res = await model.updateMany(
                        { isPublished: { $ne: true } },
                        { $set: { isPublished: true } }
                    );
                    if (res.modifiedCount > 0) {
                        console.log(`  Published ${res.modifiedCount} items`);
                    }
                }
            } catch (e) {
                console.log(`  Skipping isPublished check for ${name} (error or field missing)`);
            }
        }

        console.log("-----------------------------------");
        console.log("DATA FIX COMPLETED");
        console.log("-----------------------------------");

        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Error fixing data:", error);
        process.exit(1);
    }
};

fixData();
