const mongoose = require('mongoose');

// MongoDB connection string
const connectionString = 'mongodb://127.0.0.1:27017/Milestone';

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose.connection;