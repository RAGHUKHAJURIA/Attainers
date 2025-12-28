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

const SAMPLE_IMAGE_URL = "https://placehold.co/600x400";
const SAMPLE_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// --- DUMMY DATA ---

const dummyBlogs = [
    {
        title: "How to Crack JKSSB Exams",
        content: "Detailed guide on strategy, books, and time management for JKSSB exams...",
        excerpt: "Strategy guide for JKSSB aspirants.",
        category: "career-guidance",
        tags: ["jkssb", "strategy", "tips"],
        featuredImage: SAMPLE_IMAGE_URL,
        author: "Admin",
        isPublished: true
    },
    {
        title: "Top 10 Current Affairs Sources",
        content: "List of best websites and magazines for daily current affairs...",
        excerpt: "Best sources for current affairs.",
        category: "study-material",
        tags: ["current-affairs", "resources"],
        featuredImage: SAMPLE_IMAGE_URL,
        author: "Admin",
        isPublished: true
    },
    {
        title: "Upcoming Government Jobs in 2025",
        content: "A look at the major notifications expected this year...",
        excerpt: "Job calendar for 2025.",
        category: "government-jobs",
        tags: ["jobs", "notifications"],
        featuredImage: SAMPLE_IMAGE_URL,
        author: "Admin",
        isPublished: true
    }
];

const dummyCourses = [
    {
        title: "Complete JKSSB SI Course",
        description: "Full syllabus coverage for Sub-Inspector post.",
        shortDescription: "Best course for JKSSB SI.",
        category: "government-exams",
        subject: "General Studies",
        instructor: "Expert Faculty",
        duration: "3 Months",
        level: "intermediate",
        price: 999,
        thumbnail: SAMPLE_IMAGE_URL,
        tags: ["jkssb", "si", "police"],
        isPublished: true
    },
    {
        title: "SSC CGL Math Mastery",
        description: "Advanced math techniques for SSC CGL Tier 2.",
        shortDescription: "Master Maths for SSC.",
        category: "competitive-exams",
        subject: "Mathematics",
        instructor: "Math Wizard",
        duration: "2 Months",
        level: "advanced",
        price: 1499,
        thumbnail: SAMPLE_IMAGE_URL,
        tags: ["ssc", "math", "cgl"],
        isPublished: true
    },
    {
        title: "English for Competitive Exams",
        description: "Grammar, vocab, and comprehension basics.",
        shortDescription: "Foundation English course.",
        category: "language",
        subject: "English",
        instructor: "English Mam",
        duration: "1 Month",
        level: "beginner",
        price: 499,
        thumbnail: SAMPLE_IMAGE_URL,
        tags: ["english", "grammar"],
        isPublished: true
    }
];

const dummyNews = [
    {
        title: "JKSSB Admit Cards Released",
        content: "Download your admit cards from the official website now.",
        newsUrl: "https://jkssb.nic.in"
    },
    {
        title: "SSC CGL Results Announced",
        content: "Tier 1 results declared. Check cutoff marks.",
        newsUrl: "https://ssc.nic.in"
    },
    {
        title: "New Job Notification: 500 Posts",
        content: "Department X has released notification for 500 vacancies.",
        newsUrl: "#"
    }
];

const dummyPapers = [
    {
        title: "JKSSB SI 2021 Paper",
        examName: "JKSSB SI",
        year: 2021,
        subject: "General Knowledge",
        category: "state-psc",
        paperType: "objective",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "jkssb_si_2021.pdf",
        fileSize: 2048,
        isPublished: true
    },
    {
        title: "SSC CGL 2022 Tier 1",
        examName: "SSC CGL",
        year: 2022,
        subject: "Mixed",
        category: "ssc",
        paperType: "objective",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "ssc_cgl_2022.pdf",
        fileSize: 3000,
        isPublished: true
    }
];

const dummyTables = [
    {
        title: "JKSSB Exam Calendar 2025",
        description: "Tentative dates for upcoming exams.",
        category: "exam-schedule",
        headers: ["Exam Name", "Date", "Status"],
        data: [
            { row: ["Junior Assistant", "Jan 15", "Confirmed"] },
            { row: ["Sub Inspector", "Feb 20", "Tentative"] },
            { row: ["Patwari", "March 10", "Tentative"] }
        ]
    },
    {
        title: "SSC CGL Cutoff 2024",
        description: "Category wise cutoff marks.",
        category: "cutoff-marks",
        headers: ["Category", "Marks"],
        data: [
            { row: ["UR", "145"] },
            { row: ["OBC", "138"] },
            { row: ["SC", "120"] }
        ]
    }
];

const dummyUpdates = [
    {
        title: "Server Maintenance",
        content: "Server will be down for 2 hours tonight.",
        type: "maintenance",
        priority: 3,
        isActive: true
    },
    {
        title: "Urgent: Last Date Extended",
        content: "Application deadline for JKSSB extended by 2 days.",
        type: "urgent",
        priority: 5,
        isActive: true
    }
];

const dummyYouTube = [
    {
        title: "How to Prepare for Exams",
        description: "Best strategy video.",
        videoId: "dQw4w9WgXcQ", // Dummy ID
        thumbnail: SAMPLE_IMAGE_URL,
        category: "exam-guidance",
        isPublished: true
    },
    {
        title: "History Marathon Class",
        description: "Complete Ancient History in 3 hours.",
        videoId: "dQw4w9WgXcQ",
        thumbnail: SAMPLE_IMAGE_URL,
        category: "tutorial",
        isPublished: true
    }
];

const dummyPDFs = [
    {
        title: "Math Formulas",
        description: "All formulas.",
        category: "study-material",
        subject: "Math",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "math.pdf",
        fileSize: 1024,
        isPaid: false
    },
    {
        title: "History Notes",
        description: "Ancient history notes.",
        category: "notes",
        subject: "History",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "history.pdf",
        fileSize: 2048,
        isPaid: false
    }
];

const dummyMockTests = [
    {
        title: "Full Length Mock 1",
        examName: "General",
        totalQuestions: 100,
        duration: 90,
        difficulty: "Medium",
        description: "Test your knowledge.",
        questions: []
    },
    {
        title: "Mini Mock Test",
        examName: "General",
        totalQuestions: 20,
        duration: 20,
        difficulty: "Easy",
        description: "Quick practice.",
        questions: []
    }
];

// Seed Function
const seedAll = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/Attainers");
        console.log("Connected!");

        // 1. Seed Independent Models

        // Blog
        if (await Blog.countDocuments() === 0) {
            await Blog.insertMany(dummyBlogs);
            console.log("Seeded Blogs");
        } else console.log("Blogs already exist");

        // News
        if (await News.countDocuments() === 0) {
            await News.insertMany(dummyNews);
            console.log("Seeded News");
        } else console.log("News already exists");

        // PreviousPaper
        if (await PreviousPaper.countDocuments() === 0) {
            await PreviousPaper.insertMany(dummyPapers);
            console.log("Seeded PreviousPapers");
        } else console.log("PreviousPapers already exist");

        // Table
        if (await Table.countDocuments() === 0) {
            await Table.insertMany(dummyTables);
            console.log("Seeded Tables");
        } else console.log("Tables already exist");

        // Update
        if (await Update.countDocuments() === 0) {
            await Update.insertMany(dummyUpdates);
            console.log("Seeded Updates");
        } else console.log("Updates already exist");

        // YouTube
        if (await YouTube.countDocuments() === 0) {
            await YouTube.insertMany(dummyYouTube);
            console.log("Seeded YouTube");
        } else console.log("YouTube videos already exist");

        // PDF
        if (await PDF.countDocuments() === 0) {
            await PDF.insertMany(dummyPDFs);
            console.log("Seeded PDFs");
        } else console.log("PDFs already exist");

        // MockTest
        if (await MockTest.countDocuments() === 0) {
            await MockTest.insertMany(dummyMockTests);
            console.log("Seeded MockTests");
        } else console.log("MockTests already exist");

        // 2. Seed Dependent Models (Course -> VideoLecture)

        let courses = await Course.find();
        if (courses.length === 0) {
            courses = await Course.insertMany(dummyCourses);
            console.log("Seeded Courses");
        } else console.log("Courses already exist");

        if (await VideoLecture.countDocuments() === 0 && courses.length > 0) {
            const firstCourseId = courses[0]._id;
            const dummyLectures = [
                {
                    title: "Lecture 1: Introduction",
                    description: "Intro to the course.",
                    courseId: firstCourseId,
                    videoUrl: "https://www.youtube.com/watch?v=dummy",
                    thumbnail: SAMPLE_IMAGE_URL,
                    duration: "10:00",
                    order: 1,
                    isPublished: true
                },
                {
                    title: "Lecture 2: Basics",
                    description: "Basic concepts.",
                    courseId: firstCourseId,
                    videoUrl: "https://www.youtube.com/watch?v=dummy",
                    thumbnail: SAMPLE_IMAGE_URL,
                    duration: "15:00",
                    order: 2,
                    isPublished: true
                }
            ];
            await VideoLecture.insertMany(dummyLectures);
            console.log("Seeded VideoLectures for first Course");
        } else console.log("VideoLectures already exist or no Courses found");

        console.log("-----------------------------------");
        console.log("ALL SEEDING OPERATIONS COMPLETED");
        console.log("-----------------------------------");

        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedAll();
