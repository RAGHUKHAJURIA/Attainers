import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMemory = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024 // Limit to 15MB to be safe for MongoDB 16MB limit
    }
});
