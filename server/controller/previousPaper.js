import PreviousPaper from "../models/previousPaperModel.js";

export const createPreviousPaper = async (req, res) => {
    try {
        const paperData = req.body;

        const paper = new PreviousPaper(paperData);
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

        const total = await PreviousPaper.countDocuments(query);

        res.status(200).json({
            success: true,
            papers,
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
            paper
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

