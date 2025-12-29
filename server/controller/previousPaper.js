import PreviousPaper from "../models/previousPaperModel.js";

const fixUrl = (url, req) => {
    if (!url) return url;
    if (url.includes('cloudinary.com')) return url;

    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
        return url.replace(/http:\/\/localhost:\d+/, baseUrl).replace(/http:\/\/127\.0\.0\.1:\d+/, baseUrl);
    }
    return url;
};

export const createPreviousPaper = async (req, res) => {
    try {
        const paperData = req.body;

        if (req.file) {
            if (req.file.buffer) {
                // Buffer upload
                paperData.fileData = req.file.buffer;
                paperData.contentType = req.file.mimetype;
                paperData.fileName = req.file.originalname;
                paperData.fileSize = req.file.size;
                paperData.fileUrl = `db-storage-${Date.now()}`;
            } else {
                // Cloudinary upload
                paperData.fileUrl = req.file.path;
                paperData.fileName = req.file.originalname;
                paperData.fileSize = req.file.size;
            }
        }

        const paper = new PreviousPaper({
            ...paperData,
            isPublished: true
        });
        await paper.save();

        res.status(201).json({
            success: true,
            message: "Previous paper uploaded successfully!",
            paper
        });
    } catch (error) {
        console.error("Error creating previous paper:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllPreviousPapers = async (req, res) => {
    try {
        const { examName, year, category, paperType, subject, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        if (examName) query.examName = new RegExp(examName, 'i');
        if (year) query.year = year;
        if (category) query.category = category;
        if (paperType) query.paperType = paperType;
        if (subject) query.subject = new RegExp(subject, 'i');

        const papers = await PreviousPaper.find(query)
            .sort({ year: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const sanitizedPapers = papers.map(p => {
            const paperObj = p.toObject();
            paperObj.fileUrl = fixUrl(paperObj.fileUrl, req);
            return paperObj;
        });

        const total = await PreviousPaper.countDocuments(query);

        res.status(200).json({
            success: true,
            papers: sanitizedPapers,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching previous papers:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getPreviousPaperById = async (req, res) => {
    try {
        const { id } = req.params;
        const paper = await PreviousPaper.findById(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Previous paper not found"
            });
        }

        // Increment download count
        paper.downloadCount += 1;
        await paper.save();

        res.status(200).json({
            success: true,
            paper: {
                ...paper.toObject(),
                fileUrl: fixUrl(paper.fileUrl, req)
            }
        });
    } catch (error) {
        console.error("Error fetching previous paper:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updatePreviousPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            if (req.file.buffer) {
                updateData.fileData = req.file.buffer;
                updateData.contentType = req.file.mimetype;
                updateData.fileName = req.file.originalname;
                updateData.fileSize = req.file.size;
                updateData.fileUrl = `db-storage-${Date.now()}`;
            } else {
                updateData.fileUrl = req.file.path;
                updateData.fileName = req.file.originalname;
                updateData.fileSize = req.file.size;
            }
        }

        const paper = await PreviousPaper.findByIdAndUpdate(id, updateData, { new: true });

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Previous paper not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Previous paper updated successfully!",
            paper
        });
    } catch (error) {
        console.error("Error updating previous paper:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deletePreviousPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const paper = await PreviousPaper.findByIdAndDelete(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Previous paper not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Previous paper deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting previous paper:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

