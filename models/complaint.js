const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const complaintSchema = new Schema({
  complaintId: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
      return uuidv4();
    }
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
    enum: ['pending', 'in-progress', 'resolved', 'dismissed'],
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
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  expectedResolution: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  preferredContact: {
    type: String,
    enum: ['email', 'platform', 'phone'],
    default: 'email'
  }
}, { 
  timestamps: true 
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;