import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists

// Ensure upload directory exists
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const uploadDir = isProduction ? '/tmp' : 'uploads/';

if (!isProduction && !fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir);
    } catch (err) {
        console.error("Error creating upload directory:", err);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and PDFs are allowed!'));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});
