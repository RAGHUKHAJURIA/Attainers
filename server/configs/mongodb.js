import mongoose from "mongoose";

// connect to mongodb database
const connectDB = async () => {
  // Get connection string - try environment variable first, then fallback
  let connectionString = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!connectionString) {
    // Default connection string - make sure this matches your MongoDB Atlas connection string exactly
    connectionString = "mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/Attainers?retryWrites=true&w=majority";
  }

  // Ensure connection string has proper format
  if (!connectionString.includes('?')) {
    connectionString += '?retryWrites=true&w=majority';
  }

  try {


    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });



    // Set mongoose options
    mongoose.set('strictQuery', false);



    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });


  } catch (error) {
    console.error("\n❌ Error connecting to MongoDB:", error.message);

    // Provide more detailed error information
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('Could not connect')) {
      console.error("\n🔧 MOST LIKELY SOLUTION:");
      console.error("Your IP address is NOT whitelisted in MongoDB Atlas.");
      console.error("\n📋 Steps to fix:");
      console.error("1. Go to https://cloud.mongodb.com/");
      console.error("2. Select your cluster");
      console.error("3. Click 'Network Access' in the left sidebar");
      console.error("4. Click 'Add IP Address'");
      console.error("5. Click 'Add Current IP Address' OR add '0.0.0.0/0' (allows all IPs - for testing only)");
      console.error("6. Wait 1-2 minutes for changes to take effect");
      console.error("7. Try connecting again");
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error("\n🔧 SSL/TLS Error - This usually means:");
      console.error("1. IP address not whitelisted (most common)");
      console.error("2. Network/firewall blocking the connection");
      console.error("3. MongoDB Atlas cluster is paused");
      console.error("\nTry whitelisting your IP in MongoDB Atlas Network Access first.");
    }

    const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ':****@');
    console.error("\n🔗 Connection string used:", maskedConnectionString);
    console.error("\n💡 Tip: Get the correct connection string from MongoDB Atlas:");
    console.error("   Atlas Dashboard → Connect → Connect your application → Copy connection string");

    process.exit(1);
  }
};

export default connectDB;