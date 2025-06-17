import mongoose from "mongoose";


// MongoDB connection
const connectDB = mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/whiteboard-app"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default connectDB;