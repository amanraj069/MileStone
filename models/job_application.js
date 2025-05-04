const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const jobApplicationSchema = new Schema({
  applicationId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  freelancerId: { 
    type: String, 
    ref: 'Freelancer', 
    required: true 
  },
  jobId: { 
    type: String, 
    ref: 'Job_Listing', 
    required: true 
  },
  bidAmount: { 
    type: Number,
    required: true 
  },
  coverMessage: { 
    type: String,
    default: '' 
  },
  appliedDate: { 
    type: Date,
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending' 
  }
}, { 
  timestamps: true 
});

const JobApplication = mongoose.model('Job_Application', jobApplicationSchema);

module.exports = JobApplication;