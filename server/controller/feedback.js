import Feedback from '../models/feedbackModel.js';

// Submit feedback (Public)
export const submitFeedback = async (req, res) => {
    try {
        const { name, email, phone, subject, message, category } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, subject, and message are required'
            });
        }

        const feedback = new Feedback({
            name,
            email,
            phone,
            subject,
            message,
            category: category || 'general'
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully! We will get back to you soon.',
            data: feedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
};

// Get all feedback (Admin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

// Get single feedback (Admin)
export const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        // Mark as read
        if (!feedback.isRead) {
            feedback.isRead = true;
            feedback.status = 'read';
            await feedback.save();
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

// Update feedback status (Admin)
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { status, isRead } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status, isRead },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback updated successfully',
            data: feedback
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback',
            error: error.message
        });
    }
};

// Delete feedback (Admin)
export const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete feedback',
            error: error.message
        });
    }
};

// Delete multiple feedback (Admin)
export const deleteMultipleFeedback = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of feedback IDs'
            });
        }

        const result = await Feedback.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} feedback(s) deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete feedback',
            error: error.message
        });
    }
};
