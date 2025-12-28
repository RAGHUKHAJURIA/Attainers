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
import { getAllMockTests, getMockTestById } from "../controller/mockTest.js";

const router = express.Router();

// YouTube PubSubHubbub Webhook
router.get('/youtube/webhook', verifyWebhook);
router.post('/youtube/webhook', handleWebhook);

// Public API Routes

// News
router.get('/news', getAllNews);

// Blogs
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

// Tables
router.get('/tables', getAllTables);
router.get('/tables/:id', getTableById);

// Updates
router.get('/updates', getAllUpdates);
router.get('/updates/:id', getUpdateById);

// YouTube Videos
router.get('/youtube', getAllYouTubeVideos);
router.get('/youtube/:id', getYouTubeVideoById);

// PDFs
router.get('/pdfs', getAllPDFs);
router.get('/pdfs/:id', getPDFById);

// Courses
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);

// Video Lectures
router.get('/video-lectures', getAllVideoLectures);
router.get('/video-lectures/:id', getVideoLectureById);

// Previous Papers
router.get('/previous-papers', getAllPreviousPapers);
router.get('/previous-papers/:id', getPreviousPaperById);

// Mock Tests
router.get('/mock-tests', getAllMockTests);
router.get('/mock-tests/:id', getMockTestById);

export default router;
