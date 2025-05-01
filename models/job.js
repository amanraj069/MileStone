
// models/job.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const activeJobSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  company_name: {
    type: String
  },
  location: {
    type: String
  },
  job_type: {
    type: String
  },
  salary_range: {
    type: String
  },
  posted_date: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  },
  image: {
    type: String
  },
  description_intro: {
    type: String
  },
  bid_amount: {
    type: String
  },
  applicant_name: {
    type: String
  },
  applicant_email: {
    type: String
  },
  applicant_phone: {
    type: String
  },
  applicant_message: {
    type: String
  }
}, {
  timestamps: true
});

const ActiveJob = mongoose.model('ActiveJob', activeJobSchema);

module.exports = ActiveJob;