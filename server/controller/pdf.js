import PDF from "../models/pdfModel.js";
import fs from 'fs';
import path from 'path';

export const createPDF = async (req, res) => {
    try {
        const { title, description, category, subject, fileUrl, fileName, fileSize, pages, tags, isPaid, price, author } = req.body;
        let finalFileUrl = fileUrl;
        let finalFileName = fileName;
        let finalFileSize = fileSize;

        if (req.file) {
            finalFileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            finalFileName = req.file.originalname; // Or keep it simple
            finalFileSize = req.file.size;
        }

        const pdf = new PDF({
            title,
            description,
            category,
            subject,
            fileUrl: finalFileUrl,
            fileName: finalFileName,
            fileSize: finalFileSize,
            pages,
            tags: tags || [],
            isPaid: isPaid || false,
            price: price || 0,
            author: author || 'Admin',
            isPublished: true
        });

        await pdf.save();

        res.status(201).json({
            success: true,
            message: "PDF uploaded successfully!",
            pdf
        });
    } catch (error) {
        console.error("Error creating PDF:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllPDFs = async (req, res) => {
    try {
        const { category, subject, isPaid, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        if (category) query.category = category;
        if (subject) query.subject = subject;
        if (isPaid !== undefined) query.isPaid = isPaid === 'true';

        const pdfs = await PDF.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PDF.countDocuments(query);

        res.status(200).json({
            success: true,
            pdfs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching PDFs:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getPDFById = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await PDF.findById(id);

        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: "PDF not found"
            });
        }

        // Increment download count
        pdf.downloadCount += 1;
        await pdf.save();

        res.status(200).json({
            success: true,
            pdf
        });
    } catch (error) {
        console.error("Error fetching PDF:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updatePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            updateData.fileName = req.file.originalname;
            updateData.fileSize = req.file.size;
        }

        const pdf = await PDF.findByIdAndUpdate(id, updateData, { new: true });

        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: "PDF not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "PDF updated successfully!",
            pdf
        });
    } catch (error) {
        console.error("Error updating PDF:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deletePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await PDF.findByIdAndDelete(id);

        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: "PDF not found"
            });
        }

        // Delete associated file if it is a local upload
        if (pdf.fileUrl && pdf.fileUrl.includes('/uploads/')) {
            try {
                const filename = pdf.fileUrl.split('/uploads/')[1];
                if (filename) {
                    const filePath = path.join(process.cwd(), 'uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (err) {
                console.error("Error deleting PDF file:", err);
            }
        }

        res.status(200).json({
            success: true,
            message: "PDF deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting PDF:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

