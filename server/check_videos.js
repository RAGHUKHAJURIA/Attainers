import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./configs/mongodb.js";
import YouTube from "./models/youtubeModel.js";

dotenv.config();

const run = async () => {
    try {
        await connectDB();

        console.log("Fetching videos sorted by publishedAt: -1 (Latest First)...");
        const videos = await YouTube.find({ isPublished: true }).sort({ publishedAt: -1 });

        console.log(`Found ${videos.length} videos.`);
        if (videos.length === 0) {
            console.log("No videos found.");
        } else {
            videos.forEach((v, i) => {
                try {
                    console.log(`${i + 1}. [${v.publishedAt ? v.publishedAt.toISOString() : 'NO_DATE'}] ${v.title.substring(0, 50)}`);
                } catch (err) {
                    console.log(`${i + 1}. ERROR printing video`);
                }
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        setTimeout(() => process.exit(0), 3000);
    }
};

run();
