const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const jobApplicationSchema = new Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    freelancerId: {
      type: String,
      ref: "Freelancer",
      required: true,
    },
    jobId: {
      type: String,
      ref: "Job_Listing",
      required: true,
    },
    coverMessage: {
      type: String,
      default: "",
    },
    resumeLink: {
      type: String,
      default: "",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model("Job_Application", jobApplicationSchema);

module.exports = JobApplication;
