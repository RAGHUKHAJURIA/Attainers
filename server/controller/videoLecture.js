import VideoLecture from "../models/videoLectureModel.js";

export const createVideoLecture = async (req, res) => {
    try {
        const lectureData = req.body;

        const lecture = new VideoLecture(lectureData);
        await lecture.save();

        res.status(201).json({
            success: true,
            message: "Video lecture created successfully!",
            lecture
        });
    } catch (error) {
        console.error("Error creating video lecture:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllVideoLectures = async (req, res) => {
    try {
        const { courseId, isFree, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        if (courseId) query.courseId = courseId;
        if (isFree !== undefined) query.isFree = isFree === 'true';

        const lectures = await VideoLecture.find(query)
            .populate('courseId', 'title category')
            .sort({ order: 1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await VideoLecture.countDocuments(query);

        res.status(200).json({
            success: true,
            lectures,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching video lectures:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getVideoLectureById = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await VideoLecture.findById(id).populate('courseId', 'title category');

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Video lecture not found"
            });
        }

        // Increment view count
        lecture.viewCount += 1;
        await lecture.save();

        res.status(200).json({
            success: true,
            lecture
        });
    } catch (error) {
        console.error("Error fetching video lecture:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateVideoLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const lecture = await VideoLecture.findByIdAndUpdate(id, updateData, { new: true });

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Video lecture not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Video lecture updated successfully!",
            lecture
        });
    } catch (error) {
        console.error("Error updating video lecture:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteVideoLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await VideoLecture.findByIdAndDelete(id);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Video lecture not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Video lecture deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting video lecture:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

