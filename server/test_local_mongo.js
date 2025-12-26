
import mongoose from 'mongoose';

const testLocal = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log('Local MongoDB is running!');
        process.exit(0);
    } catch (e) {
        console.log('Local MongoDB failed:', e.message);
        process.exit(1);
    }
};

testLocal();
