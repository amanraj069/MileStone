const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const employerSchema = new Schema({
  employerId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  userId: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  companyName: { 
    type: String,
    default: '' 
  },
  websiteLink: { 
    type: String,
    default: '' 
  },
  jobsPosted: [{ 
    type: String, 
    ref: 'Job_Listing',
    default: [] 
  }],
  currentFreelancers: [{
    freelancerId: { 
      type: String, 
      ref: 'Freelancer',
      default: '' 
    },
    jobId: { 
      type: String, 
      ref: 'Job_Listing',
      default: '' 
    },
    startDate: { 
      type: Date,
      default: null 
    }
  }],
  previouslyWorkedFreelancers: [{ 
    type: String, 
    ref: 'Freelancer',
    default: [] 
  }]
}, { 
  timestamps: true 
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;