import express from "express";
import { createNews, getAllNews } from "../controller/news.js";

const router = express.Router();

router.post('/news', createNews)
router.get('/all-news', getAllNews)


export default router;