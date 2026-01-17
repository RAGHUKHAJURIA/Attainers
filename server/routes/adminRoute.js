import express from "express";
import { createNews, getAllNews } from "../controller/news.js";
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "../controller/blog.js";
import { createTable, getAllTables, getTableById, updateTable, deleteTable } from "../controller/table.js";
import { createUpdate, getAllUpdates, getUpdateById, updateUpdate, deleteUpdate } from "../controller/update.js";
import { getAllYouTubeVideos, getYouTubeVideoById, updateYouTubeVideo, subscribeToFeed, syncYouTubeVideos, deleteYouTubeVideo, deleteYouTubeShorts, createYouTubeVideo } from "../controller/youtube.js";
import { createPDF, getAllPDFs, getPDFById, updatePDF, deletePDF } from "../controller/pdf.js";
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from "../controller/course.js";
import { createVideoLecture, getAllVideoLectures, getVideoLectureById, updateVideoLecture, deleteVideoLecture } from "../controller/videoLecture.js";
import { createPreviousPaper, getAllPreviousPapers, getPreviousPaperById, updatePreviousPaper, deletePreviousPaper } from "../controller/previousPaper.js";
import { createMockTest, getAllMockTests, getMockTestById, updateMockTest, deleteMockTest, addQuestions, updateMockTestQuestion, deleteMockTestQuestion } from "../controller/mockTest.js";
import { getAllFeedback, getFeedbackById, updateFeedbackStatus, deleteFeedback, deleteMultipleFeedback } from "../controller/feedback.js";
import { protectAdminRoute } from "../middleware/clerkMiddleware.js";
import { upload } from "../middleware/upload.js";
import { uploadMemory } from "../middleware/uploadMemory.js";


const router = express.Router();

// Wrapper to handle Multer errors (File size, etc.)
const handleMemoryUpload = (req, res, next) => {
    uploadMemory.single('file')(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: "File is too large! Maximum limit is 15MB."
                });
            }
            return res.status(400).json({
                success: false,
                message: "Image upload failed",
                error: err.message
            });
        }
        next();
    });
};

const handleCloudinaryUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error("Cloudinary Upload Error:", err);
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
                error: err.message
            });
        }
        next();
    });
};

// News routes
router.post('/news', protectAdminRoute, createNews);
router.get('/all-news', getAllNews);

// Blog routes
router.post('/blogs', protectAdminRoute, handleMemoryUpload, createBlog);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.put('/blogs/:id', protectAdminRoute, handleMemoryUpload, updateBlog);
router.delete('/blogs/:id', protectAdminRoute, deleteBlog);

// Table routes
router.post('/tables', protectAdminRoute, createTable);
router.get('/tables', getAllTables);
router.get('/tables/:id', getTableById);
router.put('/tables/:id', protectAdminRoute, updateTable);
router.delete('/tables/:id', protectAdminRoute, deleteTable);

// Update routes


router.post('/updates', protectAdminRoute, handleMemoryUpload, createUpdate);
router.get('/updates', getAllUpdates);
router.get('/updates/:id', getUpdateById);
router.put('/updates/:id', protectAdminRoute, handleMemoryUpload, updateUpdate);
router.delete('/updates/:id', protectAdminRoute, deleteUpdate);

// YouTube routes
router.post('/youtube', protectAdminRoute, createYouTubeVideo);
router.get('/youtube', getAllYouTubeVideos);
router.get('/youtube/:id', getYouTubeVideoById);
router.put('/youtube/:id', protectAdminRoute, updateYouTubeVideo);
router.post('/youtube/subscribe', protectAdminRoute, subscribeToFeed);
router.post('/youtube/sync', protectAdminRoute, syncYouTubeVideos);
router.post('/youtube/delete-shorts', protectAdminRoute, deleteYouTubeShorts);
router.delete('/youtube/:id', protectAdminRoute, deleteYouTubeVideo);

// PDF routes
router.post('/pdfs', protectAdminRoute, uploadMemory.single('file'), createPDF);
router.get('/pdfs', getAllPDFs);
router.get('/pdfs/:id', getPDFById);
router.put('/pdfs/:id', protectAdminRoute, uploadMemory.single('file'), updatePDF);
router.delete('/pdfs/:id', protectAdminRoute, deletePDF);

// Course routes
router.post('/courses', protectAdminRoute, createCourse);
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', protectAdminRoute, updateCourse);
router.delete('/courses/:id', protectAdminRoute, deleteCourse);

// Video Lecture routes
router.post('/video-lectures', protectAdminRoute, createVideoLecture);
router.get('/video-lectures', getAllVideoLectures);
router.get('/video-lectures/:id', getVideoLectureById);
router.put('/video-lectures/:id', protectAdminRoute, updateVideoLecture);
router.delete('/video-lectures/:id', protectAdminRoute, deleteVideoLecture);

// Previous Paper routes
router.post('/previous-papers', protectAdminRoute, uploadMemory.single('file'), createPreviousPaper);
router.get('/previous-papers', getAllPreviousPapers);
router.get('/previous-papers/:id', getPreviousPaperById);
router.put('/previous-papers/:id', protectAdminRoute, uploadMemory.single('file'), updatePreviousPaper);
router.delete('/previous-papers/:id', protectAdminRoute, deletePreviousPaper);

// Mock Test routes
router.post('/mock-tests', protectAdminRoute, createMockTest);
router.get('/mock-tests', getAllMockTests);
router.get('/mock-tests/:id', getMockTestById);
router.put('/mock-tests/:id', protectAdminRoute, updateMockTest);
router.delete('/mock-tests/:id', protectAdminRoute, deleteMockTest);
router.post('/mock-tests/:id/questions', protectAdminRoute, addQuestions);
router.put('/mock-tests/:testId/questions/:questionId', protectAdminRoute, updateMockTestQuestion);
router.delete('/mock-tests/:testId/questions/:questionId', protectAdminRoute, deleteMockTestQuestion);

// Feedback routes (Admin)
router.get('/feedback', protectAdminRoute, getAllFeedback);
router.get('/feedback/:id', protectAdminRoute, getFeedbackById);
router.put('/feedback/:id', protectAdminRoute, updateFeedbackStatus);
router.delete('/feedback/:id', protectAdminRoute, deleteFeedback);
router.post('/feedback/delete-multiple', protectAdminRoute, deleteMultipleFeedback);

export default router;