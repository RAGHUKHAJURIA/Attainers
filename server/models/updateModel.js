import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['urgent', 'important', 'general', 'maintenance']
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date
    },
    image: {
        type: String, // URL to uploaded image (Cloudinary or local path or view URL)
        default: null
    },
    imageData: {
        type: Buffer,
        required: false
    },
    contentType: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: false
    },
    fileSize: {
        type: Number,
        required: false
    }
}, { timestamps: true });

const Update = mongoose.model("Update", updateSchema);

export default Update;

