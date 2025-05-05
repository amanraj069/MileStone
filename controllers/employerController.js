const JobListing = require("../models/job_listing");

const employerController = {
  getCurrentJobs: (req, res) => {
    res.render("Abhishek/current_jobs", {
      user: { name: "TechCorp Solutions" },
      activePage: "current_jobs",
    });
  },

  getJobListings: async (req, res) => {
    try {
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const jobListings = await JobListing.find({ employerId })
        .sort({ postedDate: -1 })
        .lean();

      res.render("Abhishek/job_listing", {
        user: { name: "TechCorp Solutions" },
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
      user: { name: "TechCorp Solutions" },
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
        user: { name: "TechCorp Solutions" },
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

  getProfile: (req, res) => {
    res.render("Abhishek/profile", {
      user: { name: "TechCorp Solutions" },
      activePage: "profile",
    });
  },

  getTransactionHistory: (req, res) => {
    res.render("Abhishek/transaction", {
      user: { name: "TechCorp Solutions" },
      activePage: "transaction_history",
    });
  },

  getMilestones: (req, res) => {
    res.render("Abhishek/milestone", {
      user: { name: "TechCorp Solutions" },
      activePage: "transaction_history",
    });
  },

  getPreviouslyWorked: (req, res) => {
    res.render("Abhishek/previously_worked", {
      user: { name: "TechCorp Solutions" },
      activePage: "previously_worked",
    });
  },

  getSubscription: (req, res) => {
    res.render("Abhishek/subscription", {
      user: { name: "TechCorp Solutions" },
      activePage: "subscription",
    });
  },
};

module.exports = employerController;