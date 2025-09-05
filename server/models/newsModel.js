import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    newsUrl: {
        type: String,
    }
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);

export default News;