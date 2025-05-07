const mongoose = require("../database");
const ActiveJob = require("../models/job_listing");

exports.getFreelancerActiveJobs = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const userId = req.session.user.id;

    // Query MongoDB for active jobs
    const activeJobs = await ActiveJob.find({ user: userId }).lean();

    // Map MongoDB documents to the format expected by the EJS template
    const formattedJobs = activeJobs.map((job) => ({
      id: job._id.toString(),
      title: job.job_title,
      company: job.company_name || "Unknown Company",
      logo: job.image || "/assets/company_logo.jpg",
      deadline: job.deadline
        ? job.deadline.toLocaleDateString()
        : "No deadline",
      price: job.bid_amount || "Not specified",
      progress: 0, // Hardcoded as in original; adjust if dynamic progress is needed
      tech: [], // Hardcoded as in original; can be updated if job has tech field
    }));

    res.render("Vanya/active_job", {
      user: req.session.user,
      active_jobs: formattedJobs,
      activePage: "active_job",
    });
  } catch (error) {
    console.error("Error fetching active jobs:", error.message);
    res.status(500).send("Server Error: Unable to load active jobs");
  }
};

exports.leaveActiveJob = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const userId = req.session.user.id;
    const jobId = req.params.jobId;

    // Delete the job from MongoDB
    const result = await ActiveJob.deleteOne({ _id: jobId, user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.status(200).json({ message: "Job left successfully" });
  } catch (error) {
    console.error("Error deleting active job:", error.message);
    res.status(500).json({ error: "Failed to leave job" });
  }
};

exports.getFreelancerProfile = async (req, res) => {
  try {
    res.render("Vanya/profile", {
      user: req.session.user || staticUser,
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error rendering profile:", error.message);
    res.status(500).send("Server Error: Unable to render profile page");
  }
};

exports.getEditFreelancerProfile = async (req, res) => {
  try {
    res.render("Vanya/edit-profile", {
      user: req.session.user || staticUser,
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error rendering profile:", error.message);
    res.status(500).send("Server Error: Unable to render edit profile page");
  }
};

exports.getFreelancerJobHistory = async (req, res) => {
  try {
    res.render("Vanya/job_history", {
      user: req.session.user || staticUser,
      activePage: "job_history",
    });
  } catch (error) {
    console.error("Error rendering job history:", error.message);
    res.status(500).send("Server Error: Unable to render job history page");
  }
};

exports.getFreelancerPayment = async (req, res) => {
  try {
    res.render("Vanya/payment", {
      user: req.session.user || staticUser,
      activePage: "payment",
    });
  } catch (error) {
    console.error("Error rendering payment:", error.message);
    res.status(500).send("Server Error: Unable to render payment page");
  }
};

exports.getFreelancerSkills = async (req, res) => {
  try {
    res.render("Vanya/skills_badges", {
      user: req.session.user || staticUser,
      activePage: "skills_badges",
    });
  } catch (error) {
    console.error("Error rendering skills_badges:", error.message);
    res.status(500).send("Server Error: Unable to render skills page");
  }
};

exports.getFreelancerSubscription = async (req, res) => {
  try {
    res.render("Vanya/subscription", {
      user: req.session.user || staticUser,
      activePage: "subscription",
    });
  } catch (error) {
    console.error("Error rendering subscription:", error.message);
    res.status(500).send("Server Error: Unable to render subscription page");
  }
};
