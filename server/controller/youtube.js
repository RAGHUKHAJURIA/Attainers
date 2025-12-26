import YouTube from "../models/youtubeModel.js";

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get video thumbnail
const getVideoThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const createYouTubeVideo = async (req, res) => {
    try {
        const { title, description, videoUrl, category, tags, isFeatured } = req.body;

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube URL"
            });
        }

        const youtube = new YouTube({
            title,
            description,
            videoId,
            thumbnail: getVideoThumbnail(videoId),
            category,
            tags: tags || [],
            isFeatured: isFeatured || false
        });

        await youtube.save();

        res.status(201).json({
            success: true,
            message: "YouTube video added successfully!",
            youtube
        });
    } catch (error) {
        console.error("Error creating YouTube video:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllYouTubeVideos = async (req, res) => {
    try {
        const { category, featured, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        if (category) {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        const videos = await YouTube.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await YouTube.countDocuments(query);

        res.status(200).json({
            success: true,
            videos,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getYouTubeVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await YouTube.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.status(200).json({
            success: true,
            video
        });
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateYouTubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If videoUrl is being updated, extract new videoId and thumbnail
        if (updateData.videoUrl) {
            const videoId = extractVideoId(updateData.videoUrl);
            if (!videoId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid YouTube URL"
                });
            }
            updateData.videoId = videoId;
            updateData.thumbnail = getVideoThumbnail(videoId);
            delete updateData.videoUrl; // Remove videoUrl as we store videoId
        }

        const video = await YouTube.findByIdAndUpdate(id, updateData, { new: true });

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Video updated successfully!",
            video
        });
    } catch (error) {
        console.error("Error updating YouTube video:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteYouTubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await YouTube.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Video deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting YouTube video:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

