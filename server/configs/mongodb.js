import mongoose from "mongoose";

// connect to mongodb database
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected:", mongoose.connection.name);
  });

  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: "Attainers", 

  });
};

export default connectDB;