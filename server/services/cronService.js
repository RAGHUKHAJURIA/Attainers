import cron from 'node-cron';
import { subscribeToYouTubeHub } from '../controller/youtube.js';
import 'dotenv/config';

export const initCronJobs = () => {
    // Schedule task to run every day at 00:00 (or better, every 23 hours to be safe)
    // Run at minute 0 past every 23rd hour.
    // simpler: '0 */23 * * *'

    console.log('Initializing Cron Jobs...');

    cron.schedule('0 */23 * * *', async () => {
        console.log('Running scheduled YouTube Subscription Renewal...');
        const channelId = process.env.YOUTUBE_CHANNEL_ID;

        if (!channelId) {
            console.warn('Skipping YouTube Subscription Renewal: YOUTUBE_CHANNEL_ID not set');
            return;
        }

        try {
            await subscribeToYouTubeHub(channelId);
            console.log(`YouTube Subscription Renewed for channel: ${channelId}`);
        } catch (error) {
            console.error('YouTube Subscription Renewal Failed:', error.message);
        }
    });

    console.log('Cron Jobs scheduled.');
};
