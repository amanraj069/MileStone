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
      enum: ["full-time", "part-time", "contract", "freelance"],
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
          enum: ["paid", "not-paid", "in-progress"],
          default: "not-paid",
        },
        requested: {
          type: Boolean,
          default: false,
        },
        subTasks: [
          {
            subTaskId: {
              type: String,
              default: uuidv4,
            },
            description: { type: String, required: true },
            status: {
              type: String,
              enum: ["pending", "in-progress", "completed"],
              default: "pending",
            },
            completedDate: {
              type: Date,
              default: null,
            },
            notes: {
              type: String,
              default: "",
            },
          },
        ],
        completionPercentage: {
          type: Number,
          default: 0,
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
    featured: {
      isActive: {
        type: Boolean,
        default: false,
      },
      category: {
        type: String,
        enum: ["urgent", "new", "high-demand"],
        default: null,
      },
      featuredAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const JobListing = mongoose.model("Job_Listing", jobListingSchema);

module.exports = JobListing;
