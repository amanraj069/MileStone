const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// MongoDB connection string from .env
const connectionString = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Export the mongoose instance
module.exports = mongoose;
