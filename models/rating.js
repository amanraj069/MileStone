const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const ratingSchema = new Schema({
  ratingId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  ratedBy: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  ratedUser: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  jobId: { 
    type: String, 
    ref: 'Job_Listing', 
    required: true 
  },
  rating: { 
    type: Number,
    required: true 
  },
  review: { 
    type: String,
    default: '' 
  },
  date: { 
    type: Date,
    default: Date.now 
  }
}, { 
  timestamps: true 
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;