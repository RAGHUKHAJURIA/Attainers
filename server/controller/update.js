import Update from "../models/updateModel.js";
import fs from 'fs';
import path from 'path';

const fixUrl = (url, req) => {
    if (!url) return url;
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
        return url.replace(/http:\/\/localhost:\d+/, baseUrl).replace(/http:\/\/127\.0\.0\.1:\d+/, baseUrl);
    }
    return url;
};

export const createUpdate = async (req, res) => {
    try {
        const { title, content, type, priority, expiryDate } = req.body;
        let image = null;

        if (req.file) {
            const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            image = `${baseUrl}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // Handle if image is sent as a URL string (e.g. from existing update)
            image = req.body.image;
        }

        const update = new Update({
            title,
            content,
            type,
            priority: priority || 1,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            image
        });

        await update.save();

        res.status(201).json({
            success: true,
            message: "Update created successfully!",
            update
        });
    } catch (error) {
        console.error("Error creating update:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllUpdates = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (type) {
            query.type = type;
        }

        // Filter out expired updates
        query.$or = [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } }
        ];

        const updates = await Update.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const sanitizedUpdates = updates.map(u => {
            const updateObj = u.toObject();
            updateObj.image = fixUrl(updateObj.image, req);
            return updateObj;
        });

        const total = await Update.countDocuments(query);

        res.status(200).json({
            success: true,
            updates: sanitizedUpdates,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching updates:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getUpdateById = async (req, res) => {
    try {
        const { id } = req.params;
        const update = await Update.findById(id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Update not found"
            });
        }

        res.status(200).json({
            success: true,
            update: {
                ...update.toObject(),
                image: fixUrl(update.image, req)
            }
        });
    } catch (error) {
        console.error("Error fetching update:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.expiryDate) {
            updateData.expiryDate = new Date(updateData.expiryDate);
        }

        if (req.file) {
            const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            updateData.image = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const update = await Update.findByIdAndUpdate(id, updateData, { new: true });

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Update not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Update updated successfully!",
            update
        });
    } catch (error) {
        console.error("Error updating update:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const update = await Update.findByIdAndDelete(id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Update not found"
            });
        }

        // Delete associated image if exists
        if (update.image) {
            try {
                const filename = update.image.split('/uploads/')[1];
                if (filename) {
                    const filePath = path.join(process.cwd(), 'uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (err) {
                console.error("Error deleting image file:", err);
            }
        }

        res.status(200).json({
            success: true,
            message: "Update deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting update:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

