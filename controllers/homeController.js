const path = require("path");
const fs = require("fs").promises;
const db = require("../database");

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
    const jobsData = await fs.readFile(
      path.join(__dirname, "../data", "posted_jobs.json"),
      "utf8"
    );
    const jobs = JSON.parse(jobsData);

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

    res.locals.user = req.session && req.session.user ? req.session.user : null;
    res.locals.dashboardRoute = dashboardRoute;

    res.render("Deepak/Job_listing_public", {
      jobs,
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
    });
  } catch (error) {
    console.error("Error loading job listings:", error);
    res.status(500).send("Server Error");
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const jobId = parseInt(req.query.jobId, 10);
    const jobsData = await fs.readFile(
      path.join(__dirname, "../data", "posted_jobs.json"),
      "utf8"
    );
    const jobs = JSON.parse(jobsData);

    if (isNaN(jobId) || jobId < 0 || jobId >= jobs.length) {
      return res
        .status(404)
        .send("Job not found. Please select a job from the listings.");
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

    const job = jobs[jobId];
    res.render("Deepak/see_more_detail", {
      job,
      user: req.session.user || null,
      dashboardRoute,
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
    job_title,
    company_name,
    location,
    job_type,
    salary_range,
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
      user_id, job_title, company_name, location, job_type, salary_range, posted_date, deadline, image, description_intro,
      bid_amount, applicant_name, applicant_email, applicant_phone, applicant_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      job_title,
      company_name,
      location,
      job_type,
      salary_range,
      posted_date,
      deadline,
      image,
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
