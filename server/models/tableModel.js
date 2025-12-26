import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['exam-schedule', 'syllabus', 'results', 'admit-cards', 'notifications', 'cutoff-marks']
    },
    data: [{
        row: [{
            type: String
        }]
    }],
    headers: [{
        type: String
    }],
    source: {
        type: String
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);

export default Table;

