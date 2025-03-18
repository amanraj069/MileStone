// controllers/freelancerController.js
const path = require("path");
const fs = require("fs").promises;

const getFreelancerData = async () => {
  try {
    const filePath = path.join(__dirname, "../data/freelancerD/data.json");
    const data = await fs.readFile(filePath, "utf8");
    const parsedData = JSON.parse(data);
    if (!parsedData.user || !parsedData.active_jobs) {
      throw new Error("Invalid JSON structure: missing required fields");
    }
    return parsedData;
  } catch (error) {
    console.error("Error reading freelancer data:", error);
    throw error;
  }
};

exports.getFreelancerActiveJobs = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/active_job", {
      user: data.user,
      active_jobs: data.active_jobs || [],
    });
  } catch (error) {
    console.error("Error in getFreelancerActiveJobs:", error);
    res.status(500).send("Server Error: Unable to load active jobs");
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

exports.getSeemore = (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../views/Abhishek/Additional/current_job_see_more.html"
    )
  );
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
