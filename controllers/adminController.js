const path = require("path");
const fs = require("fs").promises;
const User = require("../models/user");
const Employer = require("../models/employer");
const Freelancer = require("../models/freelancer");
const JobListing = require("../models/job_listing");
const Skill = require("../models/skill");
const Complaint = require("../models/complaint");
const Blog = require("../models/blog");

exports.getAdminDashboard = (req, res) => {
  res.redirect("/adminD/profile");
};

exports.getJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find().lean();
    const employerIds = [...new Set(jobs.map((job) => job.employerId))];
    const employers = await Employer.find({
      employerId: { $in: employerIds },
    }).lean();

    const employerMap = employers.reduce((map, employer) => {
      map[employer.employerId] = employer.companyName || "Unknown Company";
      return map;
    }, {});

    const jobData = jobs.map((job) => ({
      ...job,
      companyName: employerMap[job.employerId] || "Unknown Company",
      formattedBudget: `₹${job.budget.amount}/${job.budget.period}`,
      formattedDate: new Date(job.postedDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    res.render("Jayanth/job_listings", {
      user: req.session.user,
      activePage: "job_listings",
      jobs: jobData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.featureJob = async (req, res) => {
  try {
    const { jobId, featureType, isActive } = req.body;

    if (!jobId || !featureType) {
      return res.status(400).json({
        success: false,
        message: "Job ID and feature type are required",
      });
    }

    const updateData = {
      "featured.isActive": isActive,
      "featured.category": isActive ? featureType : null,
      "featured.featuredAt": isActive ? new Date() : null,
    };

    const updatedJob = await JobListing.findOneAndUpdate(
      { jobId: jobId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: `Job ${isActive ? "featured" : "unfeatured"} successfully`,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error featuring job:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating job feature status",
    });
  }
};

exports.getFreelancers = async (req, res) => {
  try {
    const searchQuery = req.query.q ? req.query.q.trim() : "";
    console.log(`Search query received: "${searchQuery}"`);

    const freelancers = await User.find({ role: "Freelancer" }).lean();
    console.log(`Found ${freelancers.length} freelancers in User collection`);

    const freelancerDetails = await Freelancer.find({
      userId: { $in: freelancers.map((f) => f.userId) },
    }).lean();
    console.log(`Found ${freelancerDetails.length} freelancer details`);

    const freelancerData = freelancers
      .map((user) => {
        const details = freelancerDetails.find((d) => d.userId === user.userId);
        const skills = details
          ? details.skills
              .map((s) => (typeof s === "object" && s.skillId ? s.skillId : s))
              .filter(Boolean)
              .join(", ")
          : "";
        return {
          userId: user.userId,
          name: user.name,
          picture: user.picture,
          rating: user.rating,
          experience: details?.experience,
          skills,
        };
      })
      .filter((freelancer) => {
        if (!searchQuery) return true;
        const nameMatch = freelancer.name
          ? freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
          : false;
        const skillsMatch = freelancer.skills
          ? freelancer.skills.toLowerCase().includes(searchQuery.toLowerCase())
          : false;
        return nameMatch || skillsMatch;
      });

    console.log(`Filtered to ${freelancerData.length} freelancers`);

    res.render("Jayanth/freelancers", {
      user: req.session.user,
      activePage: "freelancers",
      freelancers: freelancerData,
      searchQuery,
    });
  } catch (error) {
    console.error("Error in getFreelancers:", error);
    res.status(500).send("Server error");
  }
};

exports.getEmployers = async (req, res) => {
  try {
    const searchQuery = req.query.q ? req.query.q.trim() : "";
    console.log(`Employer search query received: "${searchQuery}"`);

    const employers = await User.find({ role: "Employer" }).lean();
    console.log(`Found ${employers.length} employers in User collection`);

    const employerDetails = await Employer.find({
      userId: { $in: employers.map((e) => e.userId) },
    }).lean();
    console.log(`Found ${employerDetails.length} employer details`);

    const employerData = employers
      .map((user) => {
        const details = employerDetails.find((d) => d.userId === user.userId);
        const employerEntry = {
          userId: user.userId, // Explicitly include userId
          name: user.name,
          picture: user.picture,
          rating: user.rating,
          location: user.location,
          companyName: details ? details.companyName : "",
        };
        console.log(`Employer data for ${user.name}:`, employerEntry); // Debugging
        return employerEntry;
      })
      .filter((employer) => {
        if (!searchQuery) return true;
        const nameMatch = employer.name
          ? employer.name.toLowerCase().includes(searchQuery.toLowerCase())
          : false;
        const companyNameMatch = employer.companyName
          ? employer.companyName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;
        return nameMatch || companyNameMatch;
      });

    console.log(`Filtered to ${employerData.length} employers`);

    res.render("Jayanth/employers", {
      user: req.session.user,
      activePage: "employers",
      employers: employerData,
      searchQuery,
    });
  } catch (error) {
    console.error("Error in getEmployers:", error);
    res.status(500).send("Server error");
  }
};

// ... other controller methods remain unchanged ...
exports.getComplaints = async (req, res) => {
  try {
    const searchQuery = req.query.q ? req.query.q.trim() : "";

    // Fetch all complaints from the database
    const complaints = await Complaint.find().lean();

    // Get user details for complainants (these are already userId values)
    const submittedByIds = [...new Set(complaints.map((c) => c.submittedBy))];
    const submittedByUsers = await User.find({
      userId: { $in: submittedByIds },
    }).lean();
    const submittedByMap = submittedByUsers.reduce((map, user) => {
      map[user.userId] = user;
      return map;
    }, {});

    // Get user details for complained against users (these might be employerId/freelancerId)
    const againstUserIds = [
      ...new Set(
        complaints
          .map((c) => c.againstUser)
          .filter((id) => id && id !== "general")
      ),
    ];

    // Try to find them as userIds first
    const againstUsers = await User.find({
      userId: { $in: againstUserIds },
    }).lean();
    const againstUserMap = againstUsers.reduce((map, user) => {
      map[user.userId] = user;
      return map;
    }, {});

    // For IDs not found as userIds, check if they are employerIds or freelancerIds
    for (let id of againstUserIds) {
      if (!againstUserMap[id]) {
        // Check if it's an employerId
        const employer = await Employer.findOne({ employerId: id }).lean();
        if (employer) {
          const employerUser = await User.findOne({
            userId: employer.userId,
          }).lean();
          if (employerUser) {
            againstUserMap[id] = employerUser;
          }
        } else {
          // Check if it's a freelancerId
          const freelancer = await Freelancer.findOne({
            freelancerId: id,
          }).lean();
          if (freelancer) {
            const freelancerUser = await User.findOne({
              userId: freelancer.userId,
            }).lean();
            if (freelancerUser) {
              againstUserMap[id] = freelancerUser;
            }
          }
        }
      }
    }

    // Format complaints data
    const formattedComplaints = complaints
      .map((complaint) => {
        const submittedByUser = submittedByMap[complaint.submittedBy];
        const againstUserData =
          complaint.againstUser === "general"
            ? null
            : againstUserMap[complaint.againstUser];

        return {
          ...complaint,
          submittedByName: submittedByUser?.name || "Unknown User",
          submittedByRole: submittedByUser?.role || "Unknown",
          againstUserName:
            complaint.againstUser === "general"
              ? "System/Platform"
              : againstUserData?.name || "User Not Found",
          againstUserRole:
            complaint.againstUser === "general"
              ? "General"
              : againstUserData?.role || "Unknown",
          againstUserId: againstUserData?.userId || null, // Add the actual userId for chat
          formattedDate: new Date(complaint.submittedDate).toLocaleDateString(
            "en-US",
            {
              timeZone: "UTC",
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
        };
      })
      .filter((complaint) => {
        if (!searchQuery) return true;
        const nameMatch =
          complaint.submittedByName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          complaint.againstUserName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const issueMatch = complaint.issue
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const typeMatch = complaint.complaintType
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return nameMatch || issueMatch || typeMatch;
      })
      .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)); // Sort by newest first

    res.render("Jayanth/complaints", {
      user: req.session.user,
      activePage: "complaints",
      complaints: formattedComplaints,
      searchQuery,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).send("Server error");
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { resolution } = req.body;

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: complaintId },
      {
        status: "resolved",
        resolution: resolution || "Complaint resolved by admin",
        resolvedDate: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({
      success: true,
      message: "Complaint resolved successfully",
      complaint: complaint,
    });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ error: "Failed to resolve complaint" });
  }
};

exports.dismissComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reason } = req.body;

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: complaintId },
      {
        status: "dismissed",
        resolution: reason || "Complaint dismissed by admin",
        resolvedDate: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({
      success: true,
      message: "Complaint dismissed successfully",
      complaint: complaint,
    });
  } catch (error) {
    console.error("Error dismissing complaint:", error);
    res.status(500).json({ error: "Failed to dismiss complaint" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const searchQuery = req.query.q ? req.query.q.trim() : "";

    let query = {};
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    const skills = await Skill.find(query).lean();

    const skillData = skills.map((skill) => ({
      ...skill,
      questionCount: skill.questions.length,
      totalMarks: skill.questions.reduce((sum, q) => sum + q.marks, 0),
    }));

    res.render("Jayanth/quizzes", {
      user: req.session.user,
      activePage: "quizzes",
      skills: skillData,
      searchQuery,
    });
  } catch (error) {
    console.error("Error in getQuizzes:", error);
    res.status(500).send("Server error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.session.user.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("Jayanth/profile", {
      user: user,
      activePage: "profile",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getEditProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.session.user.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("Jayanth/others/edit-profile", {
      user: user,
      activePage: "profile",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      location,
      picture,
      email,
      phone,
      linkedin,
      twitter,
      facebook,
      instagram,
      aboutMe,
    } = req.body;

    const updateData = {
      name,
      location,
      picture,
      email,
      phone,
      socialMedia: {
        linkedin,
        twitter,
        facebook,
        instagram,
      },
      aboutMe,
    };

    const user = await User.findOneAndUpdate(
      { userId: req.session.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.user = {
      ...req.session.user,
      name: user.name,
      email: user.email,
      phone: user.phone,
      picture: user.picture,
      location: user.location,
      socialMedia: user.socialMedia,
      aboutMe: user.aboutMe,
    };

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEmployer = async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.deleteOne({ userId, role: "Employer" });
    await Employer.deleteOne({ userId });
    res.json({ message: "Employer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFreelancer = async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.deleteOne({ userId, role: "Freelancer" });
    await Freelancer.deleteOne({ userId });
    res.json({ message: "Freelancer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAddQuiz = (req, res) => {
  res.render("Jayanth/others/add-quiz", {
    user: req.session.user,
    activePage: "quizzes",
  });
};

exports.addQuiz = async (req, res) => {
  try {
    const { name, questions } = req.body;

    const parsedQuestions =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    const newSkill = new Skill({
      name,
      questions: parsedQuestions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: parseInt(q.marks) || 1,
      })),
    });

    await newSkill.save();
    res.redirect("/adminD/quizzes");
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const result = await Skill.deleteOne({ skillId: req.params.skillId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill and quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEditQuiz = async (req, res) => {
  try {
    const skill = await Skill.findOne({ skillId: req.params.skillId }).lean();
    if (!skill) {
      return res.status(404).send("Skill not found");
    }
    res.render("Jayanth/others/edit-quiz", {
      user: req.session.user,
      activePage: "quizzes",
      skill,
    });
  } catch (error) {
    console.error("Error in getEditQuiz:", error);
    res.status(500).send("Server error");
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { name, questions } = req.body;
    const parsedQuestions =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    const updatedSkill = await Skill.findOneAndUpdate(
      { skillId: req.params.skillId },
      {
        name,
        questions: parsedQuestions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          marks: parseInt(q.marks) || 1,
        })),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.redirect("/adminD/quizzes");
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateFreelancerRating = async (req, res) => {
  try {
    // Check if current user is admin
    if (req.session.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { userId } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Update freelancer rating
    const updatedUser = await User.findOneAndUpdate(
      { userId, role: "Freelancer" },
      { rating: parseFloat(rating) },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json({
      success: true,
      message: "Freelancer rating updated successfully",
      rating: updatedUser.rating,
    });
  } catch (error) {
    console.error("Error updating freelancer rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmployerRating = async (req, res) => {
  try {
    // Check if current user is admin
    if (req.session.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { userId } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Update employer rating
    const updatedUser = await User.findOneAndUpdate(
      { userId, role: "Employer" },
      { rating: parseFloat(rating) },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.json({
      success: true,
      message: "Employer rating updated successfully",
      rating: updatedUser.rating,
    });
  } catch (error) {
    console.error("Error updating employer rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Blog Management Functions
exports.getBlogs = async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { tagline: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();

    const blogsData = blogs.map((blog) => ({
      ...blog,
      formattedCreatedAt: new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      readTimeDisplay: `${blog.minReadTime} min read`,
    }));

    res.render("Jayanth/blogs", {
      user: req.session.user,
      blogs: blogsData,
      searchQuery: q || "",
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Server error");
  }
};

exports.getCreateBlog = (req, res) => {
  res.render("Jayanth/others/create-blog", {
    user: req.session.user,
  });
};

exports.createBlog = async (req, res) => {
  try {
    const { title, tagline, category, imageUrl, minReadTime, content } =
      req.body;

    // Parse content if it's a string
    let parsedContent = [];
    if (typeof content === "string") {
      parsedContent = JSON.parse(content);
    } else {
      parsedContent = content;
    }

    const newBlog = new Blog({
      title,
      tagline,
      category,
      imageUrl,
      minReadTime: parseInt(minReadTime),
      content: parsedContent,
      createdBy: req.session.user.id,
    });

    await newBlog.save();

    res.json({
      success: true,
      message: "Blog created successfully",
      blogId: newBlog.blogId,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
    });
  }
};

exports.featureBlog = async (req, res) => {
  try {
    const { blogId, isFeatured } = req.body;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    // If featuring this blog, unfeature all other blogs first
    if (isFeatured) {
      await Blog.updateMany(
        { "featured.isFeatured": true },
        {
          $set: {
            "featured.isFeatured": false,
            "featured.featuredAt": null,
          },
        }
      );
    }

    const updateData = {
      "featured.isFeatured": isFeatured,
      "featured.featuredAt": isFeatured ? new Date() : null,
    };

    const updatedBlog = await Blog.findOneAndUpdate(
      { blogId: blogId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      message: `Blog ${isFeatured ? "featured" : "unfeatured"} successfully`,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error featuring blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating blog feature status",
    });
  }
};

// API endpoint for refreshing skills data (AJAX support)
exports.getSkillsAPI = async (req, res) => {
  try {
    const searchQuery = req.query.q ? req.query.q.trim() : "";

    let query = {};
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    const skills = await Skill.find(query).lean();

    const skillData = skills.map((skill) => ({
      ...skill,
      questionCount: skill.questions.length,
      totalMarks: skill.questions.reduce((sum, q) => sum + q.marks, 0),
    }));

    res.json({
      success: true,
      skills: skillData,
      total: skillData.length,
    });
  } catch (error) {
    console.error("Error in getSkillsAPI:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills data",
    });
  }
};
