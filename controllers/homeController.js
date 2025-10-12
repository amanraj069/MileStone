const db = require("../database");
const JobListing = require("../models/job_listing");
const JobApplication = require("../models/job_application");
const Employer = require("../models/employer");
const User = require("../models/user");
const Freelancer = require("../models/freelancer");
const Skill = require("../models/skill");
const Message = require("../models/message");
const Complaint = require("../models/complaint");
const Blog = require("../models/blog");

exports.getHome = async (req, res) => {
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

    // Fetch featured jobs
    const featuredJobs = await JobListing.find({
      "featured.isActive": true,
      status: { $in: ["open", "active"] },
    })
      .populate("employerId")
      .sort({ "featured.featuredAt": -1 })
      .limit(3)
      .lean();

    // Format featured jobs for display
    const formattedFeaturedJobs = await Promise.all(
      featuredJobs.map(async (job) => {
        // Get category icon based on job category or skills
        const categoryIcon = getCategoryIcon(
          job.category,
          job.description.skills
        );

        // Create budget range (30-50% variation)
        const budgetRange = createBudgetRange(job.budget.amount);

        // Calculate time since posted
        const timeAgo = getTimeAgo(job.postedDate);

        // Get description excerpt (15-20 words)
        const descriptionExcerpt = getDescriptionExcerpt(job.description.text);

        return {
          jobId: job.jobId,
          title: job.title,
          category: job.featured.type,
          icon: categoryIcon,
          budgetRange: budgetRange,
          timeAgo: timeAgo,
          description: descriptionExcerpt,
          skills: job.description.skills.slice(0, 2), // Show first 2 skills
        };
      })
    );

    res.render("Aman/home", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
      featuredJobs: formattedFeaturedJobs,
    });
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    res.render("Aman/home", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute: "",
      featuredJobs: [],
    });
  }
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

// =================== ENHANCED CHAT API ENDPOINTS ===================

// API endpoint for sending messages via AJAX
exports.sendMessageAPI = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check authentication
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { messageData } = req.body;

    // Validate input
    if (!userId || !messageData || !messageData.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or empty message",
      });
    }

    // Check message length
    if (messageData.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message too long (maximum 1000 characters)",
      });
    }

    // Validate recipient exists
    const recipient = await User.findOne({ userId }).lean();
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    // Create and save message
    const message = new Message({
      from: req.session.user.id,
      to: userId,
      messageData: messageData.trim(),
    });

    await message.save();

    // Return success response
    res.json({
      success: true,
      message: "Message sent successfully",
      data: {
        messageId: message._id,
        timestamp: message.createdAt,
      },
    });
  } catch (error) {
    console.error("Error sending message via API:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// API endpoint for fetching messages
exports.getMessagesAPI = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check authentication
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Validate recipient exists
    const recipient = await User.findOne({ userId }).lean();
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch messages between users
    const messages = await Message.find({
      $or: [
        { from: req.session.user.id, to: userId },
        { from: userId, to: req.session.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Format messages for API response
    const formattedMessages = messages.map((message) => ({
      id: message._id,
      from: message.from,
      to: message.to,
      messageData: message.messageData,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));

    res.json({
      success: true,
      message: "Messages retrieved successfully",
      messages: formattedMessages,
      count: formattedMessages.length,
    });
  } catch (error) {
    console.error("Error fetching messages via API:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// API endpoint for checking user status (online/offline simulation)
exports.getUserStatusAPI = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check authentication
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Validate user exists
    const user = await User.findOne({ userId }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Simulate user status (in a real app, this would be based on active sessions)
    // For demo purposes, we'll randomly assign online/offline status
    const isOnline = Math.random() > 0.3; // 70% chance of being online
    const lastSeen = isOnline
      ? null
      : new Date(Date.now() - Math.random() * 3600000); // Random time within last hour

    res.json({
      success: true,
      status: isOnline ? "online" : "offline",
      lastSeen: lastSeen,
      userId: userId,
      name: user.name,
    });
  } catch (error) {
    console.error("Error checking user status via API:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// API endpoint for getting chat statistics
exports.getChatStatsAPI = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check authentication
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Count messages between users
    const messageCount = await Message.countDocuments({
      $or: [
        { from: req.session.user.id, to: userId },
        { from: userId, to: req.session.user.id },
      ],
    });

    // Get latest message
    const latestMessage = await Message.findOne({
      $or: [
        { from: req.session.user.id, to: userId },
        { from: userId, to: req.session.user.id },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Count messages sent by current user
    const sentByUser = await Message.countDocuments({
      from: req.session.user.id,
      to: userId,
    });

    // Count messages received from the other user
    const receivedFromUser = await Message.countDocuments({
      from: userId,
      to: req.session.user.id,
    });

    res.json({
      success: true,
      stats: {
        totalMessages: messageCount,
        sentByYou: sentByUser,
        receivedFromThem: receivedFromUser,
        lastActivity: latestMessage ? latestMessage.createdAt : null,
        conversationStarted: latestMessage ? latestMessage.createdAt : null,
      },
    });
  } catch (error) {
    console.error("Error fetching chat stats via API:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

    // Get application counts for each job
    const jobListingsWithApplications = await Promise.all(
      jobListings.map(async (job) => {
        const applicationCount = await JobApplication.countDocuments({
          jobId: job.jobId,
        });
        return {
          ...job,
          applicationCount,
        };
      })
    );

    res.locals.user = req.session && req.session.user ? req.session.user : null;
    res.locals.dashboardRoute = dashboardRoute;

    res.render("Deepak/Job_listing_public", {
      user: req.session && req.session.user ? req.session.user : null,
      dashboardRoute,
      jobListings: jobListingsWithApplications,
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

    // Check if the current user has already applied to this job
    let hasApplied = false;
    if (req.session.user && req.session.user.role === "Freelancer") {
      const existingApplication = await JobApplication.findOne({
        freelancerId: req.session.user.roleId,
        jobId: job.jobId,
      });
      hasApplied = !!existingApplication;
    }

    res.render("Deepak/see_more_detail", {
      user: req.session.user || null,
      dashboardRoute,
      job,
      companyName: employer.companyName || "Not specified",
      hasApplied,
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

    // Debug logging
    console.log("User data:", user);
    console.log("User picture URL:", user.picture);

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
        picture:
          user.picture ||
          "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png",
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

exports.testComplaint = async (req, res) => {
  try {
    console.log("Testing complaint creation...");

    const testComplaint = new Complaint({
      submittedBy: "test-user-123",
      againstUser: "test-user-456",
      complaintType: "Test Complaint",
      issue: "This is a test complaint",
      status: "pending",
    });

    console.log("Complaint object created:", testComplaint);

    const saved = await testComplaint.save();
    console.log("Complaint saved successfully:", saved);

    res.json({ success: true, complaint: saved });
  } catch (error) {
    console.error("Error creating test complaint:", error);
    console.error("Error stack:", error.stack);
    res.json({ error: error.message, stack: error.stack });
  }
};

// Helper functions for formatting featured jobs
function getCategoryIcon(category, skills) {
  const skillsLower = skills.map((skill) => skill.toLowerCase());

  // Check for web development
  if (
    skillsLower.some((skill) =>
      ["javascript", "react", "angular", "vue", "html", "css", "node"].some(
        (tech) => skill.includes(tech)
      )
    )
  ) {
    return "fas fa-code";
  }

  // Check for design
  if (
    skillsLower.some((skill) =>
      ["design", "photoshop", "figma", "illustrator", "ui", "ux"].some((tech) =>
        skill.includes(tech)
      )
    )
  ) {
    return "fas fa-paint-brush";
  }

  // Check for writing
  if (
    skillsLower.some((skill) =>
      ["writing", "content", "copywriting", "blog"].some((tech) =>
        skill.includes(tech)
      )
    )
  ) {
    return "fas fa-pen-nib";
  }

  // Check for data science
  if (
    skillsLower.some((skill) =>
      ["python", "data", "analytics", "sql", "machine learning"].some((tech) =>
        skill.includes(tech)
      )
    )
  ) {
    return "fas fa-chart-line";
  }

  // Check for marketing
  if (
    skillsLower.some((skill) =>
      ["marketing", "seo", "social media", "advertising"].some((tech) =>
        skill.includes(tech)
      )
    )
  ) {
    return "fas fa-bullhorn";
  }

  // Default to software development
  return "fas fa-laptop-code";
}

function createBudgetRange(amount) {
  const minVariation = Math.floor(amount * 0.7); // 30% less
  const maxVariation = Math.floor(amount * 1.3); // 30% more

  return {
    min: minVariation,
    max: maxVariation,
    formatted: `₹${minVariation.toLocaleString()} - ₹${maxVariation.toLocaleString()}`,
  };
}

function getTimeAgo(postedDate) {
  const now = new Date();
  const posted = new Date(postedDate);
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays === 0) {
    return `${diffHours} hours`;
  } else if (diffDays === 1) {
    return "1 day";
  } else if (diffDays <= 30) {
    return `${diffDays} days`;
  } else {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  }
}

function getDescriptionExcerpt(description) {
  if (!description) return "No description available";

  const words = description.split(" ");
  const excerpt = words.slice(0, 18).join(" "); // Take first 18 words

  return words.length > 18 ? `${excerpt}...` : excerpt;
}

// Blog-related functions
exports.getBlogPage = async (req, res) => {
  try {
    // Get featured blog
    const featuredBlog = await Blog.getFeaturedBlog();

    // Get recent blogs (excluding featured)
    const recentBlogs = await Blog.getRecentBlogs(6);

    // Format blogs for display
    const formattedRecentBlogs = recentBlogs.map((blog) => ({
      ...blog.toObject(),
      formattedCreatedAt: blog.formattedCreatedAt,
      readTimeDisplay: blog.readTimeDisplay,
    }));

    const formattedFeaturedBlog = featuredBlog
      ? {
          ...featuredBlog.toObject(),
          formattedCreatedAt: featuredBlog.formattedCreatedAt,
          readTimeDisplay: featuredBlog.readTimeDisplay,
        }
      : null;

    res.render("Aman/blog", {
      user: req.session.user || null,
      featuredBlog: formattedFeaturedBlog,
      recentBlogs: formattedRecentBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.render("Aman/blog", {
      user: req.session.user || null,
      featuredBlog: null,
      recentBlogs: [],
    });
  }
};

exports.getBlogPost = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Find blog and increment view count
    const blog = await Blog.findOneAndUpdate(
      { blogId: blogId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).render("errors/404", {
        message: "Blog post not found",
      });
    }

    // Get related blogs (same category, excluding current)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      blogId: { $ne: blogId },
      status: "published",
    })
      .limit(3)
      .sort({ createdAt: -1 });

    const formattedBlog = {
      ...blog.toObject(),
      formattedCreatedAt: blog.formattedCreatedAt,
      readTimeDisplay: blog.readTimeDisplay,
    };

    const formattedRelatedBlogs = relatedBlogs.map((relatedBlog) => ({
      ...relatedBlog.toObject(),
      formattedCreatedAt: relatedBlog.formattedCreatedAt,
      readTimeDisplay: relatedBlog.readTimeDisplay,
    }));

    res.render("Aman/blog-post", {
      user: req.session.user || null,
      blog: formattedBlog,
      relatedBlogs: formattedRelatedBlogs,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).render("errors/500", {
      message: "Error loading blog post",
    });
  }
};
