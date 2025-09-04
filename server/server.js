import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import router from './routes/adminRoute.js';


const app = express();

app.use(cors());
app.use(express.json());

await connectDB()


app.get('/', (req, res) => {
    res.send('Home Page...')
})

app.use('/api/admin', router)

const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
})