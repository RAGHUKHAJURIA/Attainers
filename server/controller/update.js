import Update from "../models/updateModel.js";
import fs from 'fs';
import path from 'path';

const fixUrl = (url, req) => {
    if (!url) return url;
    if (url.includes('cloudinary.com')) return url;

    const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;

    if (url.startsWith('/api')) {
        return `${baseUrl}${url}`;
    }

    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return url.replace(/http:\/\/localhost:\d+/, baseUrl).replace(/http:\/\/127\.0\.0\.1:\d+/, baseUrl);
    }
    return url;
};

export const createUpdate = async (req, res) => {
    try {
        const { title, content, type, priority, expiryDate } = req.body;
        let image = null;
        let imageData = null;
        let contentType = null;

        if (req.file) {
            if (req.file.buffer) {
                // Buffer upload (Memory Storage)
                imageData = req.file.buffer;
                contentType = req.file.mimetype;
                image = `placeholder`; // Will set correct ID after save or use generic view
            } else {
                image = req.file.path;
            }
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
            image,
            imageData,
            contentType,
            fileName: req.file ? req.file.originalname : null,
            fileSize: req.file ? req.file.size : null
        });

        await update.save();

        // Update image URL if stored in DB
        if (update.imageData) {
            update.image = `/api/public/view/update/${update._id}`;
            await update.save();
        }

        res.status(201).json({
            success: true,
            message: "Update created successfully!",
            update
        });
    } catch (error) {
        console.error("Error creating update:", error);

        // Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the update.",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
            if (req.file.buffer) {
                updateData.imageData = req.file.buffer;
                updateData.contentType = req.file.mimetype;
                updateData.image = `/api/public/view/update/${id}`;
            } else {
                updateData.image = req.file.path;
            }
            updateData.fileName = req.file.originalname;
            updateData.fileSize = req.file.size;
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

