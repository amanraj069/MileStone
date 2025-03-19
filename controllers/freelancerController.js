const path = require("path");
const db = require("../database");

exports.getFreelancerActiveJobs = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please log in");
  }

  const userId = req.session.user.id;

  db.all(
    "SELECT * FROM active_jobs WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching active jobs:", err);
        return res.status(500).send("Server Error: Unable to load active jobs");
      }

      const activeJobs = rows.map((job) => ({
        id: job.id, // Add job ID for deletion
        title: job.job_title,
        company: job.company_name,
        logo: job.image,
        deadline: job.deadline,
        price: job.bid_amount,
        progress: 0,
        tech: [],
      }));

      res.render("Vanya/active_job", {
        user: req.session.user,
        active_jobs: activeJobs,
      });
    }
  );
};

exports.leaveActiveJob = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const userId = req.session.user.id;
  const jobId = req.params.jobId;

  const query = "DELETE FROM active_jobs WHERE id = ? AND user_id = ?";
  db.run(query, [jobId, userId], function (err) {
    if (err) {
      console.error("Error deleting active job:", err);
      return res.status(500).json({ error: "Failed to leave job" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }
    res.status(200).json({ message: "Job left successfully" });
  });
};

exports.getFreelancerProfile = async (req, res) => {
  try {
    res.render("Vanya/profile", { user: req.session.user, profile: {} });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerJobHistory = async (req, res) => {
  try {
    res.render("Vanya/job_history", {
      user: req.session.user,
      job_history: [],
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getSeemore = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Vanya/additional/jhistory_see_more.html")
  );
};

exports.getFreelancerPayment = async (req, res) => {
  try {
    res.render("Vanya/payment", { user: req.session.user, payments: [] });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerSkills = async (req, res) => {
  try {
    res.render("Vanya/skills_badges", {
      user: req.session.user,
      skills_badges: [],
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getFreelancerSubscription = async (req, res) => {
  try {
    res.render("Vanya/subscription", {
      user: req.session.user,
      subscription: {},
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

exports.getChatsCurrentJobs = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Vanya/additional/chat.html"));
};
