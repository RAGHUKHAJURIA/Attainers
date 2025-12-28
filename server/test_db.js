import mongoose from 'mongoose';
import 'dotenv/config';

const connect = async () => {
    try {
        const uri = process.env.MONGODB_URL || "mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/youtube";
        console.log("Attempting to connect to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

        await mongoose.connect(uri);
        console.log("✅ Connection Successful!");
        await mongoose.connection.close();
    } catch (error) {
        console.error("❌ Connection Failed:");
        console.error(error.message);
        console.error("Full Error:", error);
    }
};

connect();
