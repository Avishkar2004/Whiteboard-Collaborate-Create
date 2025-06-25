import mongoose from "mongoose";

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
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
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/whiteboard-app";
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI configured:", !!process.env.MONGODB_URI);
    
    const connection = await mongoose.connect(mongoUri, mongoOptions);
    console.log("✅ Connected to MongoDB");
    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default connectDB;