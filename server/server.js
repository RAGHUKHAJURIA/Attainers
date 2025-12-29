import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import publicRoute from './routes/publicRoute.js';
import router from './routes/adminRoute.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();


const allowedOrigins = [
    'https://attainers-yerb.vercel.app',
    'https://attainers.vercel.app',
    'http://localhost:5173',
    'http://localhost:5000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
// Parse JSON for standard requests
app.use(express.json());
// Parse XML/Atom feeds as raw text for the webhook
app.use(express.text({ type: 'application/atom+xml' }));

const uploadDir = (process.env.NODE_ENV === 'production' || process.env.VERCEL) ? '/tmp' : 'uploads';
app.use('/uploads', express.static(uploadDir));

import { initCronJobs } from './services/cronService.js';


// Define routes before starting server
app.get('/', (req, res) => {
    res.send('Home Page...')
})

app.use('/api/admin', clerkMiddleware(), router)
app.use('/api/public', publicRoute)

// Global 404 Handler for API
app.use((req, res) => {
    res.status(404).json({ success: false, message: "API Route not found" });
});

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDB();
        initCronJobs();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};


if (process.env.VERCEL) {
    // Vercel Serverless environment
    connectDB().catch(err => console.error("MongoDB Connection Error:", err));
    initCronJobs();
} else {
    // Local development
    startServer();
}

export default app;