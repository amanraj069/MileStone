const db = require("../database");
const JobListing = require("../models/job_listing");
const JobApplication = require("../models/job_application");
const Employer = require("../models/employer");
const User = require("../models/user");
const Freelancer = require("../models/freelancer");
const Skill = require("../models/skill");
const Message = require("../models/message");

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

exports.getBlog = (req, res) => {
  res.render("Aman/blog");
};

exports.getChat = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    // Fetch the recipient user
    const recipient = await User.findOne({ userId }).lean();
    if (!recipient) {
      return res.status(404).send("User not found");
    }

    // Ensure the user is logged in
    if (!req.session.user) {
      return res.redirect("/login?error=Please log in to chat");
    }

    // Fetch messages between the logged-in user and the recipient
    const messages = await Message.find({
      $or: [
        { from: req.session.user.id, to: userId },
        { from: userId, to: req.session.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    let dashboardRoute = "";
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
    res.render("Aman/chat", {
      user: req.session.user,
      dashboardRoute,
      recipient: {
        userId: recipient.userId,
        name: recipient.name || "Unknown User",
        picture: recipient.picture || "/assets/user_female.png",
      },
      messages,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error("Error loading chat:", error);
    res.status(500).send("Server Error");
  }
};

exports.sendMessage = async (req, res) => {
  const userId = req.params.userId; // Define userId at function scope
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect(
        `/chat/${userId}?error=Please log in to send messages`
      );
    }

    const { messageData } = req.body;

    if (!userId || !messageData) {
      return res.redirect(`/chat/${userId}?error=Missing required fields`);
    }

    const recipient = await User.findOne({ userId }).lean();
    if (!recipient) {
      return res.redirect(`/chat/${userId}?error=User not found`);
    }

    const message = new Message({
      from: req.session.user.id,
      to: userId,
      messageData,
    });

    await message.save();

    res.redirect(`/chat/${userId}`);
  } catch (error) {
    console.error("Error sending message:", error);
    res.redirect(`/chat/${userId}?error=Failed to send message`);
  }
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
      return res
        .status(404)
        .send("Job not found. Please select a job from the listings.");
    }

    // Fetch the employer details using the employerId from the job
    const employer = await Employer.findOne({
      employerId: job.employerId,
    }).lean();
    console.log("Fetched employer:", employer);

    if (!employer) {
      return res.status(404).send("Employer not found for this job.");
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
      companyName: employer.companyName || "Not specified",
    });
  } catch (error) {
    console.error("Error loading job details:", error);
    res.status(500).send("Server Error");
  }
};

exports.getJobApplication = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    console.log("Job ID for application:", jobId);

    if (!jobId) {
      return res.status(400).send("Job ID is required");
    }

    const job = await JobListing.findOne({ jobId }).lean();
    console.log("Fetched job for application:", job);

    if (!job) {
      return res.status(404).send("Job not found");
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

    res.render("Deepak/jobs_apply", {
      user: req.session.user || null,
      dashboardRoute,
      job,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error("Error loading job application page:", error);
    res.status(500).send("Server Error");
  }
};

exports.applyForJob = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== "Freelancer") {
      return res.redirect(
        `/jobs/apply/${req.params.jobId}?error=Unauthorized: Please log in as a Freelancer`
      );
    }

    const { jobId, coverMessage, resumeLink } = req.body;
    const freelancerId = req.session.user.roleId;

    console.log("Received jobId:", jobId);

    if (!jobId || !coverMessage || !resumeLink) {
      return res.redirect(`/jobs/apply/${jobId}?error=Missing required fields`);
    }

    const job = await JobListing.findOne({ jobId });
    console.log("Found job:", job);

    if (!job) {
      return res.redirect(`/jobs/apply/${jobId}?error=Job not found`);
    }

    const existingApplication = await JobApplication.findOne({
      freelancerId,
      jobId,
    });

    if (existingApplication) {
      return res.redirect(
        `/jobs/apply/${jobId}?error=You can't apply to the same job more than once, wait for it to get approved.`
      );
    }

    const jobApplication = new JobApplication({
      freelancerId,
      jobId,
      coverMessage,
      resumeLink,
      status: "Pending",
    });

    await jobApplication.save();

    res.redirect(`/jobs/application-submitted/${jobId}?success=true`);
  } catch (error) {
    console.error("Error submitting job application:", error);
    res.redirect(
      `/jobs/apply/${req.body.jobId}?error=Failed to submit application`
    );
  }
};

exports.getApplicationSubmitted = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    console.log("Job ID for success page:", jobId);

    if (!jobId) {
      return res.status(400).send("Job ID is required");
    }

    const job = await JobListing.findOne({ jobId }).lean();
    console.log("Fetched job for success page:", job);

    if (!job) {
      return res
        .status(404)
        .send("Job not found. Please select a job from the listings.");
    }

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

    const success = req.query.success === "true";

    res.render("Deepak/application_submitted", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
      success,
      job,
    });
  } catch (error) {
    console.error("Error loading application submitted page:", error);
    res.status(500).send("Server Error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;
    // console.log("Fetching profile for freelancerId:", freelancerId);

    if (!freelancerId) {
      return res.status(400).send("Freelancer ID is required");
    }

    // Fetch the user where role is Freelancer and roleId matches freelancerId
    const user = await User.findOne({
      role: "Freelancer",
      roleId: freelancerId,
    }).lean();
    if (!user) {
      return res.status(404).send("Freelancer user not found");
    }

    // Fetch the freelancer data using the freelancerId
    const freelancer = await Freelancer.findOne({ freelancerId }).lean();
    if (!freelancer) {
      return res.status(404).send("Freelancer profile not found");
    }

    // Fetch skill names based on skillIds in freelancer.skills
    const skillIds = (freelancer.skills || []).map((skill) => skill.skillId);
    const skills = await Skill.find({ skillId: { $in: skillIds } }).lean();
    const skillNames = skills.map((skill) => skill.name);

    // Set dashboard route based on logged-in user
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

    // Render the profile with the fetched data
    res.render("Aman/common_profile", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
      profileData: {
        name: user.name || "N/A",
        role: user.role || "Freelancer",
        location: user.location || "N/A",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        picture: user.picture || "/assets/user_female.png",
        aboutMe: user.aboutMe || "No description provided.",
        skills: skillNames || [],
        experience: freelancer.experience || [],
        education: freelancer.education || [],
        portfolio: freelancer.portfolio || [],
        resume: freelancer.resume || "#",
      },
    });
  } catch (error) {
    console.error("Error fetching freelancer profile:", error);
    res.status(500).send("Server Error: Unable to load freelancer profile");
  }
};
