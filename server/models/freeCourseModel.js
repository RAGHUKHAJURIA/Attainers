import mongoose from "mongoose";

const freeCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    playlistId: {
        type: String,
        required: true,
        unique: true
    },
    playlistLink: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: false
    },
    videoCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

const FreeCourse = mongoose.model("FreeCourse", freeCourseSchema);

export default FreeCourse;
