const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const complaintSchema = new Schema({
  complaintId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  submittedBy: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  againstUser: { 
    type: String, 
    ref: 'User', 
    required: true 
  },
  complaintType: { 
    type: String,
    required: true 
  },
  jobId: { 
    type: String, 
    ref: 'Job_Listing',
    default: '' 
  },
  issue: { 
    type: String,
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending' 
  },
  resolution: { 
    type: String,
    default: '' 
  },
  submittedDate: { 
    type: Date,
    default: Date.now 
  },
  resolvedDate: { 
    type: Date,
    default: null 
  }
}, { 
  timestamps: true 
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;