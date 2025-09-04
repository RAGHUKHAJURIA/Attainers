import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    newsUrl: {
        tyepe: String,
    }
})

const News = mongoose.model("News", newsSchema);

export default News;