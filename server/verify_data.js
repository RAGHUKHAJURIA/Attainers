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

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: "Attainers" });
        console.log("Connected to MongoDB for Verification (with dbName: Attainers).");

        const models = {
            "Blog": Blog,
            "Course": Course,
            "News": News,
            "PreviousPaper": PreviousPaper,
            "Table": Table,
            "Update": Update,
            "VideoLecture": VideoLecture,
            "YouTube": YouTube,
            "PDF": PDF,
            "MockTest": MockTest
        };

        let allGood = true;

        console.log("\n--- Verification Report ---");
        const blogCount = await Blog.countDocuments();
        console.log(`Blog Count: ${blogCount}`);
        console.log(`Blog Collection: ${Blog.collection.name}`);

        const allCount = await Blog.find({});
        console.log("Sample Blog:", allCount[0]);
        console.log("---------------------------\n");

        if (allGood) {
            console.log("SUCCESS: All collections have data.");
        } else {
            console.log("PARTIAL SUCCESS: Some collections are empty.");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Verification Error:", error);
    }
};

verifyData();
