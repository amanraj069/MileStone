const path = require("path");
const fs = require("fs").promises;

exports.getAdminDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Jayanth/admin.html"));
};

exports.getJobListings = async (req, res) => {
  try {
    const jobListingsData = await fs.readFile(
      path.join(__dirname, "../data/adminD/job_listings.json"),
      "utf8"
    );
    const jobListings = JSON.parse(jobListingsData);
    res.render("Jayanth/job_listings", {
      jobListings,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).send("Error loading job listings page");
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobListingsData = await fs.readFile(
      path.join(__dirname, "../data/adminD/job_listings.json"),
      "utf8"
    );
    const jobListings = JSON.parse(jobListingsData);
    const job = jobListings.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.render("Jayanth/Additional/see_more_detail", {
      job,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).send("Error loading job details page");
  }
};

exports.getFreelancers = async (req, res) => {
  try {
    const freelancersData = await fs.readFile(
      path.join(__dirname, "../data/adminD/freelancers.json"),
      "utf8"
    );
    const freelancers = JSON.parse(freelancersData);
    res.render("Jayanth/freelancers", {
      freelancers,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.status(500).send("Error loading freelancers page");
  }
};

exports.getEmployers = async (req, res) => {
  try {
    const employersData = await fs.readFile(
      path.join(__dirname, "../data/adminD/employers.json"),
      "utf8"
    );
    const employers = JSON.parse(employersData);
    res.render("Jayanth/employers", {
      employers,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).send("Error loading employers page");
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaintsData = await fs.readFile(
      path.join(__dirname, "../data/adminD/complaints.json"),
      "utf8"
    );
    const complaints = JSON.parse(complaintsData);
    res.render("Jayanth/complaints", {
      complaints,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).send("Error loading complaints page");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profileData = await fs.readFile(
      path.join(__dirname, "../data/adminD/profile.json"),
      "utf8"
    );
    const profile = JSON.parse(profileData);
    res.render("Jayanth/profile", {
      profile,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Error loading profile page");
  }
};
