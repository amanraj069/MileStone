// controllers/freelancerController.js
const path = require("path");
const fs = require("fs").promises;

const getFreelancerData = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../data/freelancer_data.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading freelancer data:", error);
    throw error;
  }
};

exports.getFreelancerProfile = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/profile", { user: data.user, profile: data.profile });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerActiveJobs = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/active_job", {
      user: data.user,
      active_jobs: data.active_jobs,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerJobHistory = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/job_history", {
      user: data.user,
      job_history: data.job_history,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerPayment = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/payment", { user: data.user, payments: data.payments });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerSkills = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/skills_badges", {
      user: data.user,
      skills_badges: data.skills_badges,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerSubscription = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/subscription", {
      user: data.user,
      subscription: data.subscription,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
