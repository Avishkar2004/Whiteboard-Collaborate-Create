import mongoose from "mongoose";

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: "majority",
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

// MongoDB connection
const connectDB = mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/whiteboard-app",
    mongoOptions
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return mongoose.connection;
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    throw err;
  });

export default connectDB;