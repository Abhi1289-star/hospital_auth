import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    // 🔍 DEBUG: check if env is loaded
    console.log("🔍 MONGO_URI from env:", process.env.MONGO_URI);

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ MONGO_URI not found in environment variables");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);

   
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default dbConnection;
