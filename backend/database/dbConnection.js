import mongoose from "mongoose";

const dbConnection = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "Some error occurred while connecting to database:",
      error.message
    );
    process.exit(1);
  }
};

export default dbConnection;
