import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get top users for leaderboard
router.get('/', async (req, res) => {
    try {
        // Fetch top 50 users sorted by averageScore descending
        // Only include users who have taken at least 1 test
        const leaderboard = await User.find({ totalTestsTaken: { $gt: 0 } })
            .sort({ averageScore: -1 })
            .limit(50)
            .select('firstName lastName avatar averageScore totalTestsTaken');

        res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
