import express from "express";
import { verifyWebhook, handleWebhook } from "../controller/youtube.js";
import { getAllNews } from "../controller/news.js";
import { getAllBlogs, getBlogById } from "../controller/blog.js";
import { getAllTables, getTableById } from "../controller/table.js";
import { getAllUpdates, getUpdateById } from "../controller/update.js";
import { getAllYouTubeVideos, getYouTubeVideoById } from "../controller/youtube.js";
import { getAllPDFs, getPDFById } from "../controller/pdf.js";
import { getAllCourses, getCourseById } from "../controller/course.js";
import { getAllVideoLectures, getVideoLectureById } from "../controller/videoLecture.js";
import { getAllPreviousPapers, getPreviousPaperById } from "../controller/previousPaper.js";
import { getAllMockTests, getPublicMockTestById } from "../controller/mockTest.js";
import { submitFeedback } from "../controller/feedback.js";
import { downloadFile, viewFile } from "../controller/download.js";

const router = express.Router();

// ... (existing routes)

// Mock Tests
router.get('/mock-tests', getAllMockTests);
router.get('/mock-tests/:id', getPublicMockTestById);

// Secure Download
router.get('/download/:type/:id', downloadFile);
router.get('/view/:type/:id', viewFile);

// Feedback (Public)
router.post('/feedback', submitFeedback);

export default router;
