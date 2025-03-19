const path = require("path");
const db = require("../database");
const fs = require("fs").promises;

const getFreelancerData = async () => {
  try {
    const filePath = path.join(__dirname, "../data/freelancerD/data.json");
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`Data file not found at ${filePath}`);
    }

    const data = await fs.readFile(filePath, "utf8");

    if (!data.trim()) {
      throw new Error("Data file is empty");
    }

    const parsedData = JSON.parse(data);

    if (
      !parsedData.user ||
      !parsedData.active_jobs ||
      !parsedData.job_history
    ) {
      throw new Error(
        "Invalid JSON structure: missing required fields (user, active_jobs, or job_history)"
      );
    }

    return parsedData;
  } catch (error) {
    console.error("Error reading freelancer data:", error.message);
    return {
      user: { id: 0, name: "Unknown User", role: "Freelancer" },
      job_history: [],
      active_jobs: [],
      payments: [],
      skills_badges: [],
      subscription: {},
    };
  }
};

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
        id: job.id,
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
    console.error("Error rendering profile:", error.message);
    res.status(500).send("Server Error: Unable to render profile page");
  }
};

exports.getFreelancerJobHistory = async (req, res) => {
  try {
    const data = await getFreelancerData();
    const renderData = {
      user: req.session.user || data.user,
      job_history: data.job_history,
    };
    console.log(
      "Data being passed to job_history.ejs:",
      JSON.stringify(renderData, null, 2)
    );

    res.render("Vanya/job_history", renderData, (err, html) => {
      if (err) {
        console.error("Error rendering job_history template:", err.message);
        return res
          .status(500)
          .send("Server Error: Unable to render job history page");
      }
      res.send(html);
    });
  } catch (error) {
    console.error("Error in getFreelancerJobHistory:", error.message);
    res.status(500).send("Server Error: Unable to load job history");
  }
};

exports.getSeemore = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Vanya/additional/jhistory_see_more.html")
  );
};

exports.getFreelancerPayment = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/payment", {
      user: req.session.user || data.user,
      payments: data.payments,
    });
  } catch (error) {
    console.error("Error rendering payment:", error.message);
    res.status(500).send("Server Error: Unable to render payment page");
  }
};

exports.getFreelancerSkills = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/skills_badges", {
      user: req.session.user || data.user,
      skills_badges: data.skills_badges,
    });
  } catch (error) {
    console.error("Error rendering skills_badges:", error.message);
    res.status(500).send("Server Error: Unable to render skills page");
  }
};

exports.getFreelancerSubscription = async (req, res) => {
  try {
    const data = await getFreelancerData();
    res.render("Vanya/subscription", {
      user: req.session.user || data.user,
      subscription: data.subscription,
    });
  } catch (error) {
    console.error("Error rendering subscription:", error.message);
    res.status(500).send("Server Error: Unable to render subscription page");
  }
};

exports.getChatsCurrentJobs = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Vanya/additional/chat.html"));
};
