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
        } else {
            return res.status(400).json({ success: false, message: "Invalid download type" });
        }

        const item = await model.findById(id);

        if (!item) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const fileUrl = item.fileUrl;
        if (!fileUrl) {
            return res.status(404).json({ success: false, message: "No file attached" });
        }

        // Extract filename from URL (assuming /uploads/filename structure)
        // This regex handles both localhost and production URLs we might have fixed earlier
        const matches = fileUrl.match(/\/uploads\/(.+)$/);

        if (!matches || !matches[1]) {
            // Fallback: try to just get the basename if simple structure
            // But ideally we rely on the path we know
            return res.status(500).json({ success: false, message: "Invalid file path in database" });
        }

        const filename = matches[1];

        // Determine file path based on environment
        // In local: root/uploads/filename
        // In Vercel/Prod: /tmp/filename (if uploaded there) or we might need another strategy if using persistent storage service like S3/Cloudinary.
        // NOTE: If using Vercel file system, files uploaded to /tmp persist only for that request. 
        // If the user is using simple disk storage on a stateful server (VPS), this works.
        // If on Vercel without S3, previous uploads are lost anyway. 
        // Assuming VPS/Stateful server based on 'uploads' usage.

        const uploadDir = (process.env.NODE_ENV === 'production' && process.env.VERCEL) ? '/tmp' : 'uploads';
        const filePath = path.join(process.cwd(), uploadDir, filename);

        if (fs.existsSync(filePath)) {
            // Increment download count
            item.downloadCount = (item.downloadCount || 0) + 1;
            await item.save();

            res.download(filePath, item.fileName || filename, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    if (!res.headersSent) {
                        res.status(500).send("Could not download file");
                    }
                }
            });
        } else {
            console.error(`File not found on server: ${filePath}`);
            // Check if it's a full remote URL (e.g. if moved to S3 later)
            // For now, assuming local filesystem per user workspace
            return res.status(404).json({ success: false, message: "File not found on server storage." });
        }

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
