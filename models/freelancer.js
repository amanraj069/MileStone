const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const freelancerSchema = new Schema({
  freelancerId: { 
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
  title: { 
    type: String,
    default: '' 
  },
  resume: { 
    type: String,
    default: '' 
  },
  skills: [{ 
    type: String,
    default: [] 
  }],
  experience: [{
    title: { type: String, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  education: [{
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    date: { type: String, default: '' }
  }],
  portfolio: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    link: { type: String, default: '' }
  }],
  badges: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    dateEarned: { type: String, default: '' }
  }],
  badgeProgress: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    progress: { type: String, default: '' },
    percentage: { type: Number, default: 0 }
  }],
  activeJobs: [{
    jobId: { 
      type: String, 
      ref: 'Job_Listing',
      default: '' 
    },
    progress: { 
      type: Number,
      default: 0 
    },
    startDate: { 
      type: Date,
      default: null 
    }
  }],
  jobHistory: [{
    jobId: { 
      type: String, 
      ref: 'Job_Listing',
      default: '' 
    },
    status: { 
      type: String,
      default: '' 
    },
    cancelReason: { 
      type: String,
      default: '' 
    }
  }]
}, { 
  timestamps: true 
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;