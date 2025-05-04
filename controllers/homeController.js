const db = require("../database");
const JobListing = require("../models/job_listing");

exports.getHome = (req, res) => {
  let dashboardRoute = "";
  if (req.session && req.session.user) {
    switch (req.session.user.role) {
      case "Admin":
        dashboardRoute = "/adminD/profile";
        break;
      case "Employer":
        dashboardRoute = "/employerD/profile";
        break;
      case "Freelancer":
        dashboardRoute = "/freelancerD/profile";
        break;
    }
  }
  res.render("Aman/home", {
    user: req.session && req.session.user ? req.session.user : null,
    dashboardRoute,
  });
};

exports.getJobListing = async (req, res) => {
  try {
    let dashboardRoute = "";
    if (req.session && req.session.user) {
      switch (req.session.user.role) {
        case "Admin":
          dashboardRoute = "/adminD/profile";
          break;
        case "Employer":
          dashboardRoute = "/employerD/profile";
          break;
        case "Freelancer":
          dashboardRoute = "/freelancerD/profile";
          break;
      }
    }

    const jobListings = await JobListing.find({ status: "open" }).lean();
    console.log("Fetched job listings:", jobListings);

    res.locals.user = req.session && req.session.user ? req.session.user : null;
    res.locals.dashboardRoute = dashboardRoute;

    res.render("Deepak/Job_listing_public", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
      jobListings,
    });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).send("Error fetching job listings");
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.query.jobId;
    console.log("Job ID from request:", jobId);

    if (!jobId) {
      return res.status(400).send("Job ID is required");
    }

    const job = await JobListing.findOne({ jobId }).lean();
    console.log("Fetched job:", job);

    if (!job) {
      return res.status(404).send("Job not found. Please select a job from the listings.");
    }

    let dashboardRoute = "";
    if (req.session.user) {
      switch (req.session.user.role) {
        case "Admin":
          dashboardRoute = "/adminD/profile";
          break;
        case "Employer":
          dashboardRoute = "/employerD/profile";
          break;
        case "Freelancer":
          dashboardRoute = "/freelancerD/profile";
          break;
      }
    }

    res.render("Deepak/see_more_detail", {
      user: req.session.user || null,
      dashboardRoute,
      job,
    });
  } catch (error) {
    console.error("Error loading job details:", error);
    res.status(500).send("Server Error");
  }
};

exports.applyForJob = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const {
    job_id,
    job_title,
    employer_id,
    location,
    job_type,
    budget_amount,
    budget_period,
    posted_date,
    deadline,
    image,
    description_intro,
    bid_amount,
    applicant_name,
    applicant_email,
    applicant_phone,
    applicant_message,
  } = req.body;

  const userId = req.session.user.id;

  const query = `
    INSERT INTO active_jobs (
      user_id, job_id, job_title, employer_id, location, job_type, budget_amount, budget_period, posted_date, deadline, image, description_intro,
      bid_amount, applicant_name, applicant_email, applicant_phone, applicant_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      job_id,
      job_title,
      employer_id,
      location,
      job_type,
      budget_amount,
      budget_period,
      posted_date,
      deadline,
      image || null,
      description_intro,
      bid_amount,
      applicant_name,
      applicant_email,
      applicant_phone,
      applicant_message,
    ],
    function (err) {
      if (err) {
        console.error("Error saving job application:", err);
        return res.status(500).json({ error: "Failed to save application" });
      }
      res.status(200).json({ message: "Application submitted successfully" });
    }
  );
};