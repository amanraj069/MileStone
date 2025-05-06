const JobListing = require("../models/job_listing");
const JobApplication = require("../models/job_application");
const User = require("../models/user");

const employerController = {
  getCurrentJobs: (req, res) => {
    res.render("Abhishek/current_jobs", {
      user: { name: req.session.user.name },
      activePage: "current_jobs",
    });
  },

  getJobListings: async (req, res) => {
    try {
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      // Fetch job listings, excluding those with status "closed" or "completed"
      const jobListings = await JobListing.find({
        employerId,
        status: { $nin: ["closed", "completed"] },
      })
        .sort({ postedDate: -1 })
        .lean();

      res.render("Abhishek/job_listing", {
        user: { name: req.session.user.name },
        activePage: "job_listings",
        jobListings,
      });
    } catch (error) {
      console.error("Error fetching job listings:", error.message);
      res.status(500).send("Error fetching job listings: " + error.message);
    }
  },

  getNewJobForm: (req, res) => {
    res.render("Abhishek/others/new_job", {
      user: { name: req.session.user.name },
      activePage: "job_listings",
    });
  },

  createJobListing: async (req, res) => {
    try {
      const {
        title,
        budget,
        imageUrl,
        location,
        jobType,
        experienceLevel,
        remote,
        applicationDeadline,
        description,
        milestones,
      } = req.body;

      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const newJob = new JobListing({
        employerId,
        imageUrl,
        title,
        budget: {
          amount: Number(budget.amount),
          period: budget.period,
        },
        location,
        jobType,
        experienceLevel,
        remote: remote === "true",
        applicationDeadline,
        description: {
          text: description.text,
          responsibilities: description.responsibilities
            .split("\n")
            .filter((r) => r.trim()),
          requirements: description.requirements
            .split("\n")
            .filter((r) => r.trim()),
          skills: description.skills.split("\n").filter((s) => s.trim()),
        },
        milestones: milestones.map((m) => ({
          description: m.description,
          deadline: m.deadline,
          payment: m.payment,
          status: "pending",
        })),
      });

      await newJob.save();
      res.redirect("/employerD/job_listings");
    } catch (error) {
      console.error("Error creating job listing:", error.message);
      res.status(500).send("Error creating job listing: " + error.message);
    }
  },

  getEditJobForm: async (req, res) => {
    try {
      const { jobId } = req.params;
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const job = await JobListing.findOne({ jobId, employerId }).lean();
      if (!job) {
        throw new Error("Job not found or you are not authorized to edit it");
      }

      res.render("Abhishek/others/update_job", {
        user: { name: req.session.user.name },
        activePage: "job_listings",
        job,
      });
    } catch (error) {
      console.error("Error fetching job for editing:", error.message);
      res.status(500).send("Error fetching job for editing: " + error.message);
    }
  },

  updateJobListing: async (req, res) => {
    try {
      const { jobId } = req.params;
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const {
        title,
        budget,
        imageUrl,
        location,
        jobType,
        experienceLevel,
        remote,
        applicationDeadline,
        description,
        milestones,
      } = req.body;

      const updatedJob = {
        imageUrl,
        title,
        budget: {
          amount: Number(budget.amount),
          period: budget.period,
        },
        location,
        jobType,
        experienceLevel,
        remote: remote === "true",
        applicationDeadline,
        description: {
          text: description.text,
          responsibilities: description.responsibilities
            .split("\n")
            .filter((r) => r.trim()),
          requirements: description.requirements
            .split("\n")
            .filter((r) => r.trim()),
          skills: description.skills.split("\n").filter((s) => s.trim()),
        },
        milestones: milestones.map((m) => ({
          description: m.description,
          deadline: m.deadline,
          payment: m.payment,
          status: m.status || "pending",
        })),
      };

      const job = await JobListing.findOneAndUpdate(
        { jobId, employerId },
        { $set: updatedJob },
        { new: true }
      );

      if (!job) {
        throw new Error("Job not found or you are not authorized to update it");
      }

      res.redirect("/employerD/job_listings");
    } catch (error) {
      console.error("Error updating job listing:", error.message);
      res.status(500).send("Error updating job listing: " + error.message);
    }
  },

  getJobApplications: async (req, res) => {
    try {
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      // Find all jobs for this employer
      const jobs = await JobListing.find({ employerId }).lean();
      const jobIds = jobs.map((job) => job.jobId);

      // Find all applications for these jobs
      const applications = await JobApplication.find({
        jobId: { $in: jobIds },
      }).lean();

      // Fetch user data for freelancers
      const freelancerIds = [
        ...new Set(applications.map((app) => app.freelancerId)),
      ];
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId name picture")
        .lean();

      // Map applications with job titles and freelancer info
      const applicationsWithDetails = applications.map((application) => {
        const job = jobs.find((job) => job.jobId === application.jobId);
        const user = users.find(
          (user) => user.roleId === application.freelancerId
        );
        return {
          ...application,
          jobTitle: job?.title || "Unknown Job",
          freelancerName: user?.name || "Unknown Freelancer",
          freelancerPicture: user?.picture || null,
        };
      });

      res.render("Abhishek/job_applications", {
        user: { name: req.session.user.name },
        activePage: "job_applications",
        applications: applicationsWithDetails,
      });
    } catch (error) {
      console.error("Error fetching job applications:", error.message);
      res.status(500).send("Error fetching job applications: " + error.message);
    }
  },

  acceptJobApplication: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      // Find the application
      const application = await JobApplication.findOne({ applicationId });
      if (!application) {
        throw new Error("Application not found");
      }

      // Verify the job belongs to this employer
      const job = await JobListing.findOne({ jobId: application.jobId });
      if (!job || job.employerId !== employerId) {
        throw new Error("Not authorized to modify this application");
      }

      // Update application status to "Accepted"
      await JobApplication.findOneAndUpdate(
        { applicationId },
        { $set: { status: "Accepted" } }
      );

      // Assign the freelancer to the job listing, set startDate, and close the job
      await JobListing.findOneAndUpdate(
        { jobId: application.jobId },
        {
          $set: {
            "assignedFreelancer.freelancerId": application.freelancerId,
            "assignedFreelancer.startDate": new Date(),
            status: "closed",
          },
        }
      );

      res.redirect("/employerD/job_applications");
    } catch (error) {
      console.error("Error accepting job application:", error.message);
      res.status(500).send("Error accepting job application: " + error.message);
    }
  },

  rejectJobApplication: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      // Find the application
      const application = await JobApplication.findOne({ applicationId });
      if (!application) {
        throw new Error("Application not found");
      }

      // Verify the job belongs to this employer
      const job = await JobListing.findOne({ jobId: application.jobId });
      if (!job || job.employerId !== employerId) {
        throw new Error("Not authorized to modify this application");
      }

      // Update application status
      await JobApplication.findOneAndUpdate(
        { applicationId },
        { $set: { status: "Rejected" } }
      );

      res.redirect("/employerD/job_applications");
    } catch (error) {
      console.error("Error rejecting job application:", error.message);
      res.status(500).send("Error rejecting job application: " + error.message);
    }
  },

  getProfile: (req, res) => {
    res.render("Abhishek/profile", {
      user: { name: req.session.user.name },
      activePage: "profile",
    });
  },
  
  getEditProfile: (req, res) => {
    res.render("Abhishek/edit-profile", {
      user: { name: "TechCorp Solutions" },
      activePage: "profile",
    });
  },

  getTransactionHistory: (req, res) => {
    res.render("Abhishek/transaction", {
      user: { name: req.session.user.name },
      activePage: "transaction_history",
    });
  },

  getMilestones: (req, res) => {
    res.render("Abhishek/milestone", {
      user: { name: req.session.user.name },
      activePage: "transaction_history",
    });
  },

  getPreviouslyWorked: (req, res) => {
    res.render("Abhishek/previously_worked", {
      user: { name: req.session.user.name },
      activePage: "previously_worked",
    });
  },

  getSubscription: (req, res) => {
    res.render("Abhishek/subscription", {
      user: { name: req.session.user.name },
      activePage: "subscription",
    });
  },

  getMilestone: (req, res) => {
    res.render("Abhishek/others/milestone", {
      user: { name: req.session.user.name },
      activePage: "transaction_history",
    });
  },
};

module.exports = employerController;