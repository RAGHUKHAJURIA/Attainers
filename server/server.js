import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import publicRoute from './routes/publicRoute.js';
import router from './routes/adminRoute.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cors());
// Parse JSON for standard requests
app.use(express.json());
// Parse XML/Atom feeds as raw text for the webhook
app.use(express.text({ type: 'application/atom+xml' }));
app.use('/uploads', express.static('uploads'));

import { initCronJobs } from './services/cronService.js';

await connectDB();
initCronJobs();


app.get('/', (req, res) => {
    res.send('Home Page...')
})

app.use('/api/admin', clerkMiddleware(), router)
app.use('/api/public', publicRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
})