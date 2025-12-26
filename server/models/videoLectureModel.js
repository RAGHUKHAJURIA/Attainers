import mongoose from "mongoose";

const videoLectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['pdf', 'doc', 'ppt', 'link']
        }
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const VideoLecture = mongoose.model("VideoLecture", videoLectureSchema);

export default VideoLecture;

