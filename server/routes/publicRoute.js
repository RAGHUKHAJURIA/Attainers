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
import { getFreeCourses } from "../controller/freeCourse.js";
import Result from '../models/Result.js';
import User from '../models/User.js';

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
router.get('/mock-tests/:id', getPublicMockTestById);

// Secure Download
router.get('/download/:type/:id', downloadFile);
router.get('/view/:type/:id', viewFile);

// Feedback (Public)
router.post('/feedback', submitFeedback);
// Free Courses
router.get('/free-courses', getFreeCourses);

// Submit Mock Test Result
router.post('/mock-tests/:id/submit', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userEmail, userFirstName, userLastName, userAvatar, score, totalQuestions, correctAnswers, wrongAnswers, unattempted } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        // 1. Find or Create User
        let user = await User.findOne({ clerkId: userId });
        if (!user) {
            user = new User({
                clerkId: userId,
                email: userEmail,
                firstName: userFirstName,
                lastName: userLastName,
                avatar: userAvatar
            });
        } else {
            // Update user details in case they changed
            user.firstName = userFirstName || user.firstName;
            user.lastName = userLastName || user.lastName;
            user.avatar = userAvatar || user.avatar;
            user.email = userEmail || user.email;
        }

        // 2. Save Result
        const newResult = new Result({
            userId: user._id,
            mockTestId: id,
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            unattempted
        });
        await newResult.save();

        // 3. Update User Stats (Average Score)
        // Calculate new average
        const currentTotalScore = user.averageScore * user.totalTestsTaken;
        const newTotalScore = currentTotalScore + score;
        user.totalTestsTaken += 1;
        user.averageScore = newTotalScore / user.totalTestsTaken;

        await user.save();

        res.status(200).json({ success: true, message: 'Result submitted successfully' });

    } catch (error) {
        console.error('Error submitting test result:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
