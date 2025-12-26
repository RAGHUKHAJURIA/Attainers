import Course from "../models/courseModel.js";

export const createCourse = async (req, res) => {
    try {
        const courseData = req.body;

        const course = new Course(courseData);
        await course.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully!",
            course
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const { category, level, isFeatured, page = 1, limit = 12 } = req.query;
        const query = { isPublished: true };

        if (category) query.category = category;
        if (level) query.level = level;
        if (isFeatured === 'true') query.isFeatured = true;

        const courses = await Course.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            courses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const course = await Course.findByIdAndUpdate(id, updateData, { new: true });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            course
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

