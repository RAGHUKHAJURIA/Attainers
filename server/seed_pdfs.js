import mongoose from 'mongoose';
import PDF from './models/pdfModel.js';
import 'dotenv/config';

// Sample PDF URL that actually works
const SAMPLE_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const dummyPDFs = [
    {
        title: "Generic Math Formulas",
        description: "A comprehensive list of all essential math formulas for high school students.",
        category: "study-material",
        subject: "Mathematics",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "math_formulas.pdf",
        fileSize: 1024 * 500, // ~500KB
        pages: 5,
        isPaid: false,
        price: 0,
        author: "Admin",
        tags: ["math", "formulas", "basics"]
    },
    {
        title: "Physics - Newton's Laws",
        description: "Detailed explanation of Newton's three laws of motion with examples.",
        category: "notes",
        subject: "Physics",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "physics_newton.pdf",
        fileSize: 1024 * 1200, // ~1.2MB
        pages: 12,
        isPaid: false,
        price: 0,
        author: "Dr. Physics",
        tags: ["physics", "dynamics", "mechanics"]
    },
    {
        title: "History of Ancient India",
        description: "An in-depth look at the ancient civilizations of India, from Indus Valley to the Guptas.",
        category: "reference-books",
        subject: "History",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "ancient_india.pdf",
        fileSize: 1024 * 5000, // ~5MB
        pages: 150,
        isPaid: true,
        price: 499,
        author: "History Dept",
        tags: ["history", "ancient", "india"]
    },
    {
        title: "JKSSB SI Syllabus 2025",
        description: "Official syllabus for the upcoming JKSSB Sub-Inspector examination.",
        category: "syllabus",
        subject: "General Knowledge",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "jkssb_si_syllabus.pdf",
        fileSize: 1024 * 200, // ~200KB
        pages: 2,
        isPaid: false,
        price: 0,
        author: "Admin",
        tags: ["syllabus", "jkssb", "si"]
    },
    {
        title: "Chemistry - Periodic Table",
        description: "High quality image and properties of the modern periodic table.",
        category: "study-material",
        subject: "Chemistry",
        fileUrl: SAMPLE_PDF_URL,
        fileName: "periodic_table.pdf",
        fileSize: 1024 * 800, // ~800KB
        pages: 1,
        isPaid: false,
        price: 0,
        author: "ChemMaster",
        tags: ["chemistry", "periodic table"]
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database...");

        await PDF.insertMany(dummyPDFs);
        console.log("Dummy PDFs inserted successfully!");

        mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
