// controllers/homeController.js
const path = require("path");
const fs = require("fs").promises; // Use promises for async file reading

exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Aman", "home.html"));
};

exports.getVanya = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Vanya", "active_job.html"));
};

exports.getJobListing = async (req, res) => {
  try {
    const jobsData = await fs.readFile(
      path.join(__dirname, "../data", "posted_jobs.json"),
      "utf8"
    );
    const jobs = JSON.parse(jobsData);
    res.render("Deepak/Job_listing_public", { jobs });
  } catch (error) {
    console.error("Error loading job listings:", error);
    res.status(500).send("Server Error");
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const jobId = parseInt(req.query.jobId, 10); // Get jobId from query parameter
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

    const job = jobs[jobId];
    res.render("Deepak/see_more_detail", { job });
  } catch (error) {
    console.error("Error loading job details:", error);
    res.status(500).send("Server Error");
  }
};
