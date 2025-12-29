import path from 'path';
import fs from 'fs';
import PDF from '../models/pdfModel.js';
import PreviousPaper from '../models/previousPaperModel.js';

export const downloadFile = async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;

        if (type === 'pdf') {
            model = PDF;
        } else if (type === 'paper') {
            model = PreviousPaper;
        } else if (type === 'update') {
            const { default: Update } = await import('../models/updateModel.js');
            model = Update;
        } else {
            return res.status(400).json({ success: false, message: "Invalid download type" });
        }

        const item = await model.findById(id);

        if (!item) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        // 0. Check if file is stored in DB (Buffer)
        const fileBuffer = item.fileData || item.imageData;
        if (fileBuffer) {
            res.setHeader('Content-Type', item.contentType || 'application/pdf');
            const safeFileName = (item.fileName || 'download.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
            if (item.fileSize) {
                res.setHeader('Content-Length', item.fileSize);
            }
            return res.send(fileBuffer);
        }

        const fileUrl = item.fileUrl;
        if (!fileUrl) {
            return res.status(404).json({ success: false, message: "No file attached" });
        }

        // Increment download count (already done above, but good to keep flow clear)

        // 1. Check if it is a Cloudinary URL (or any remote URL)
        if (fileUrl.startsWith('http') && (fileUrl.includes('cloudinary') || !fileUrl.includes(req.get('host')))) {
            // For Cloudinary, we want to force download if possible.
            // Cloudinary allows adding flags to URL for attachment.
            // If regular remote URL, just redirect.
            return res.redirect(fileUrl);
        }

        // 2. Fallback for legacy local files
        const matches = fileUrl.match(/\/uploads\/(.+)$/);

        if (!matches || !matches[1]) {
            // Try to use fileUrl as relative path if it doesn't match
            return res.redirect(fileUrl);
        }

        const filename = matches[1];

        // Assume legacy files are in 'uploads' folder locally (dev) or lost (prod)
        const uploadDir = (process.env.NODE_ENV === 'production' && process.env.VERCEL) ? '/tmp' : 'uploads';
        const filePath = path.join(process.cwd(), uploadDir, filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath, item.fileName || filename, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    if (!res.headersSent) {
                        res.status(500).send("Could not download file");
                    }
                }
            });
        } else {
            // If local file is missing (common in Vercel for old uploads), we can't do much.
            return res.status(404).json({ success: false, message: "File not found on server storage." });
        }

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const viewFile = async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;

        if (type === 'pdf') {
            model = PDF;
        } else if (type === 'paper') {
            model = PreviousPaper;
        } else if (type === 'update') {
            const { default: Update } = await import('../models/updateModel.js');
            model = Update;
        } else if (type === 'blog') {
            const { default: Blog } = await import('../models/blogModel.js');
            model = Blog;
        } else {
            return res.status(400).send("Invalid type");
        }

        const item = await model.findById(id);

        if (!item) {
            return res.status(404).send("File not found");
        }

        // Check for imageData (Updates/Blogs) or fileData (PDFs/Papers)
        const buffer = item.imageData || item.fileData;
        const contentType = item.contentType || 'application/octet-stream';

        if (buffer) {
            res.setHeader('Content-Type', contentType);
            // Inline disposition to view in browser
            res.setHeader('Content-Disposition', `inline; filename="${item.fileName || 'file'}"`);
            return res.send(buffer);
        }

        // Fallback to URL redirection if not in DB
        if (item.image) return res.redirect(item.image);
        if (item.featuredImage) return res.redirect(item.featuredImage);
        if (item.fileUrl) return res.redirect(item.fileUrl);

        return res.status(404).send("No content found");

    } catch (error) {
        console.error("View Error:", error);
        res.status(500).send("Server Error");
    }
};
