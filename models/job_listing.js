const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const jobListingSchema = new Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    employerId: {
      type: String,
      ref: "Employer",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    budget: {
      amount: { type: Number, required: true },
      period: { type: String, required: true },
    },
    location: {
      type: String,
      default: "",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior"],
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    description: {
      text: { type: String, required: true },
      responsibilities: [{ type: String, default: [] }],
      requirements: [{ type: String, default: [] }],
      skills: [{ type: String, default: [] }],
    },
    milestones: [
      {
        milestoneId: {
          type: String,
          default: uuidv4,
        },
        description: { type: String, required: true },
        deadline: { type: String, required: true },
        payment: { type: String, required: true },
        status: {
          type: String,
          enum: ["paid", "not-paid"],
          default: "not-paid",
        },
        requested: {
          type: Boolean,
          default: false,
        },
      },
    ],
    assignedFreelancer: {
      freelancerId: {
        type: String,
        ref: "Freelancer",
        default: "",
      },
      startDate: {
        type: Date,
        default: null,
      },
      status: {
        type: String,
        enum: ["notworking", "working", "finished","left"],
        default: "working",
      },
    },
    status: {
      type: String,
      enum: ["active", "open", "in-progress", "completed", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const JobListing = mongoose.model("Job_Listing", jobListingSchema);

module.exports = JobListing;
