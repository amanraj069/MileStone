const path = require("path");
const fs = require("fs").promises;

const getProfileData = async () => {
  const filePath = path.join(__dirname, "../data/EmployerD/profile.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const getTransactionData = async () => {
  const filePath = path.join(__dirname, "../data/EmployerD/transaction.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const getJobsData = async () => {
  const filePath = path.join(__dirname, "../data/EmployerD/jobs.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const getCurrentPreviousData = async () => {
  const filePath = path.join(
    __dirname,
    "../data/EmployerD/current_previous.json"
  );
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

exports.getEmployerProfile = async (req, res) => {
  try {
    const profileData = await getProfileData();
    res.render("Abhishek/profile", { data: profileData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getJobListings = async (req, res) => {
  try {
    const jobsData = await getJobsData();
    res.render("Abhishek/job_listing", { jobs: jobsData.jobs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getCurrentJobs = async (req, res) => {
  try {
    const data = await getCurrentPreviousData();
    res.render("Abhishek/current_jobs", {
      current_freelancers: data.current_freelancers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getPreviouslyWorked = async (req, res) => {
  try {
    const data = await getCurrentPreviousData();
    res.render("Abhishek/previously_worked", {
      previous_freelancers: data.previous_freelancers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const transactionData = await getTransactionData();
    res.render("Abhishek/transaction", {
      transactions: transactionData.transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const profileData = await getProfileData();
    res.render("Abhishek/subscription", { data: profileData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getChatsCurrentJobs = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/Additional/chat.html"));
};

exports.getSeemoreCurrentJobs = (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../views/Abhishek/Additional/current_job_see_more.html"
    )
  );
};

exports.geSeemoreJoblistings = async (req, res) => {
  try {
    const jobsData = await getJobsData();
    const jobId = req.params.jobId;
    const job = jobsData.jobs.find((j) => j.id === jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.render("Abhishek/Additional/see_more_detail", { job });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getmilestoneTransactionHistory = async (req, res) => {
  try {
    const transactionData = await getTransactionData();
    const transactionId = req.params.txnId;
    const transaction = transactionData.transactions.find(
      (t) => t.id === transactionId
    );
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }
    res.render("Abhishek/Additional/milestone", { transaction });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getmilestoneCurrentjob = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/milestone.html"));
};

exports.getDetailsofAppliers = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Abhishek/Additional/view_profile.html")
  );
};
