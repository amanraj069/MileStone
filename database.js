const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './.env' }); // Explicitly specify .env path

// MongoDB connection string from .env
const connectionString = process.env.MONGODB_URI;

// Debug log to verify URI
console.log("MongoDB URI:", connectionString);

// Validate connection string
if (!connectionString) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
    return mongoose;
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Export the connection promise
module.exports = connectDB;