const JobListing = require("../models/job_listing");
const User = require("../models/user");
const Employer = require("../models/employer");
const Freelancer = require("../models/freelancer");
const Skill = require("../models/skill");
const Complaint = require("../models/complaint");
const { uploadToCloudinary } = require("../middleware/imageUpload");

exports.getFreelancerActiveJobs = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;
    
    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();

    const activeJobs = await JobListing.find({
      "assignedFreelancer.freelancerId": freelancerId,
      "assignedFreelancer.status": "working",
    }).lean();

    const employerIds = activeJobs
      .map((job) => job.employerId)
      .filter((id) => id);
    const users = await User.find({ roleId: { $in: employerIds } })
      .select("roleId userId")
      .lean();

    const formattedJobs = await Promise.all(
      activeJobs.map(async (job) => {
        const paidAmount = job.milestones
          .filter((milestone) => milestone.status === "paid")
          .reduce(
            (sum, milestone) => sum + parseFloat(milestone.payment) || 0,
            0
          );

        const totalBudget = parseFloat(job.budget.amount) || 0;
        const progress =
          totalBudget > 0 ? Math.min((paidAmount / totalBudget) * 100, 100) : 0;

        const employer = await Employer.findOne({
          employerId: job.employerId,
        }).lean();
        const companyName = employer ? employer.companyName : "Unknown Company";

        const user = users.find((u) => u.roleId === job.employerId);

        return {
          id: job.jobId,
          title: job.title,
          company: companyName,
          logo: job.imageUrl || "/assets/company_logo.jpg",
          deadline: job.applicationDeadline
            ? job.applicationDeadline.toLocaleDateString()
            : "No deadline",
          price: job.budget.amount
            ? `Rs.${parseFloat(job.budget.amount).toFixed(2)}`
            : "Not specified",
          progress: Math.round(progress),
          tech: job.description.skills || [],
          employerUserId: user?.userId || "", // Include employer's userId from User table
        };
      })
    );

    res.render("Vanya/active_job", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      active_jobs: formattedJobs,
      activePage: "active_job",
    });
  } catch (error) {
    console.error("Error fetching active jobs:", error.message);
    res.status(500).send("Server Error: Unable to load active jobs");
  }
};

exports.leaveActiveJob = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const freelancerId = req.session.user.roleId;
    const jobId = req.params.jobId;

    const result = await JobListing.updateOne(
      {
        jobId: jobId,
        "assignedFreelancer.freelancerId": freelancerId,
        "assignedFreelancer.status": "working",
      },
      { $set: { "assignedFreelancer.status": "left" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.status(200).json({ message: "Job left successfully" });
  } catch (error) {
    console.error("Error leaving active job:", error.message);
    res.status(500).json({ error: "Failed to leave job" });
  }
};

exports.getFreelancerProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      throw new Error("Unauthorized: Please log in");
    }

    const userId = req.session.user.id;
    const freelancerId = req.session.user.roleId;

    if (!userId || !freelancerId) {
      throw new Error("User ID or Freelancer roleId not found in session");
    }

    const user = await User.findOne({ userId }).lean();
    if (!user) {
      throw new Error("User not found");
    }

    const freelancer = await Freelancer.findOne({ freelancerId }).lean();
    if (!freelancer) {
      throw new Error("Freelancer profile not found");
    }

    const skillIds = (freelancer.skills || []).map((skill) => skill.skillId);
    const skills = await Skill.find({ skillId: { $in: skillIds } }).lean();
    const skillNames = skills.map((skill) => skill.name);

    await res.render("Vanya/profile", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
        skills: skillNames,
        experience: freelancer.experience || [],
        education: freelancer.education || [],
        portfolio: freelancer.portfolio || [],
        resume: freelancer.resume || "",
      },
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).send("Error fetching profile: " + error.message);
  }
};

exports.getEditFreelancerProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;

    const user = await User.findOne({ roleId: freelancerId }).lean();
    if (!user) {
      return res.status(404).send("User not found");
    }

    const freelancer = await Freelancer.findOne({
      freelancerId: freelancerId,
    }).lean();
    if (!freelancer) {
      return res.status(404).send("Freelancer profile not found");
    }

    const profileData = {
      ...user,
      ...freelancer,
    };

    res.render("Vanya/others/edit-profile", {
      user: profileData,
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error rendering edit profile:", error.message);
    res.status(500).send("Server Error: Unable to render edit profile page");
  }
};

exports.updateFreelancerProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const freelancerId = req.session.user.roleId;
    const {
      name,
      title,
      location,
      email,
      phone,
      about,
      experienceData,
      educationData,
      portfolioData,
      resumeLink,
      skills,
    } = req.body;

    // Get current user data to preserve existing picture if no new file uploaded
    // Parse data early so we can use it for file processing
    const parsedExperience =
      typeof experienceData === "string" ? JSON.parse(experienceData) : experienceData || [];
    const parsedEducation =
      typeof educationData === "string" ? JSON.parse(educationData) : educationData || [];
    const parsedPortfolio =
      typeof portfolioData === "string" ? JSON.parse(portfolioData) : portfolioData || [];
    const parsedSkills =
      typeof skills === "string" ? JSON.parse(skills) : skills || [];

    const currentUser = await User.findOne({ roleId: freelancerId }).lean();
    let pictureUrl = currentUser?.picture; // Default to existing picture

    // Handle profile image upload
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.profileImage[0].buffer, 'freelancer-profiles', 'image');
        pictureUrl = uploadResult.secure_url; // Cloudinary secure URL
      } catch (uploadError) {
        console.error("Error uploading profile image to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Failed to upload profile image" });
      }
    }

    // Handle portfolio images upload
    let updatedPortfolio = [...parsedPortfolio]; // Create a copy to modify
    if (req.files && req.files.portfolioImages && req.files.portfolioImages.length > 0) {
      try {
        for (let i = 0; i < req.files.portfolioImages.length; i++) {
          const file = req.files.portfolioImages[i];
          const uploadResult = await uploadToCloudinary(file.buffer, 'freelancer-portfolio', 'image');
          
          // Find the corresponding portfolio item and update its image
          if (updatedPortfolio[i]) {
            updatedPortfolio[i].image = uploadResult.secure_url;
          }
        }
      } catch (uploadError) {
        console.error("Error uploading portfolio images to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Failed to upload portfolio images" });
      }
    }

    const userUpdate = await User.updateOne(
      { roleId: freelancerId },
      {
        $set: {
          name,
          email,
          phone,
          location,
          picture: pictureUrl,
          aboutMe: about,
        },
      }
    );

    if (userUpdate.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const freelancerUpdate = await Freelancer.updateOne(
      { freelancerId: freelancerId },
      {
        $set: {
          resume: resumeLink, // Use the provided resume link
          skills: parsedSkills || [],
          experience: parsedExperience || [],
          education: parsedEducation || [],
          portfolio: updatedPortfolio || [], // Use updated portfolio with images
        },
      }
    );

    if (freelancerUpdate.matchedCount === 0) {
      return res.status(404).json({ error: "Freelancer profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Server Error: Unable to update profile" });
  }
};

exports.getFreelancerJobHistory = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;
    
    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();

    const historyJobs = await JobListing.find({
      "assignedFreelancer.freelancerId": freelancerId,
      "assignedFreelancer.status": { $in: ["finished", "left"] },
    }).lean();

    const formattedJobs = await Promise.all(
      historyJobs.map(async (job) => {
        const paidAmount = job.milestones
          .filter((milestone) => milestone.status === "paid")
          .reduce(
            (sum, milestone) => sum + parseFloat(milestone.payment) || 0,
            0
          );

        const employer = await Employer.findOne({
          employerId: job.employerId,
        }).lean();
        const companyName = employer ? employer.companyName : "Unknown Company";

        return {
          id: job.jobId,
          title: job.title,
          company: companyName,
          logo: job.imageUrl || "/assets/company_logo.jpg",
          status: job.assignedFreelancer.status,
          tech: job.description.skills || [],
          date: `${
            job.assignedFreelancer.startDate
              ? job.assignedFreelancer.startDate.toLocaleDateString()
              : "Unknown"
          } - ${
            job.updatedAt ? job.updatedAt.toLocaleDateString() : "Unknown"
          }`,
          price: paidAmount ? `Rs.${paidAmount.toFixed(2)}` : "Not paid",
          rating: job.rating || 0,
        };
      })
    );

    res.render("Vanya/job_history", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      history_jobs: formattedJobs,
      activePage: "job_history",
    });
  } catch (error) {
    console.error("Error rendering job history:", error.message);
    res.status(500).send("Server Error: Unable to render job history page");
  }
};

exports.getFreelancerPayment = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;
    
    // Fetch user and freelancer data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();
    const freelancer = await Freelancer.findOne({ freelancerId }).lean();

    const activeJobs = await JobListing.find({
      "assignedFreelancer.freelancerId": freelancerId,
      "assignedFreelancer.status": "working",
    }).lean();

    const formattedJobs = await Promise.all(
      activeJobs.map(async (job) => {
        const paidAmount = job.milestones
          .filter((milestone) => milestone.status === "paid")
          .reduce(
            (sum, milestone) => sum + parseFloat(milestone.payment) || 0,
            0
          );

        const totalBudget = parseFloat(job.budget.amount) || 0;
        const progress =
          totalBudget > 0 ? Math.min((paidAmount / totalBudget) * 100, 100) : 0;

        const employer = await Employer.findOne({
          employerId: job.employerId,
        }).lean();
        const companyName = employer ? employer.companyName : "Unknown Company";

        return {
          id: job.jobId,
          title: job.title,
          company: companyName,
          skills: job.description.skills || [],
          deadline: job.applicationDeadline
            ? job.applicationDeadline.toLocaleDateString()
            : "No deadline",
          amount: job.budget.amount
            ? `Rs.${parseFloat(job.budget.amount).toFixed(2)}`
            : "Not specified",
          progress: Math.round(progress),
        };
      })
    );

    res.render("Vanya/payment", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      jobs: formattedJobs,
      activePage: "payment",
    });
  } catch (error) {
    console.error("Error rendering payment:", error.message);
    res.status(500).send("Server Error: Unable to render payment page");
  }
};

exports.getFreelancerSkills = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;
    
    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();

    const freelancer = await Freelancer.findOne({ freelancerId }).lean();
    if (!freelancer) {
      return res.status(404).send("Freelancer profile not found");
    }

    const allSkills = await Skill.find().lean();

    const freelancerSkillIds = freelancer.skills.map((skill) => skill.skillId);
    const freelancerSkills = await Skill.find({
      skillId: { $in: freelancerSkillIds },
    }).lean();

    const skillsData = allSkills.map((skill) => ({
      skillId: skill.skillId,
      name: skill.name,
      hasQuiz: skill.questions && skill.questions.length > 0,
      isAcquired: freelancerSkillIds.includes(skill.skillId),
    }));

    res.render("Vanya/skills_badges", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      skills: skillsData,
      freelancerSkills: freelancerSkills.map((skill) => skill.name),
      activePage: "skills_badges",
    });
  } catch (error) {
    console.error("Error rendering skills_badges:", error.message);
    res.status(500).send("Server Error: Unable to render skills page");
  }
};

exports.getFreelancerSubscription = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();
    
    if (!user) {
      console.error("User not found in database for ID:", req.session.user.id);
      return res.status(404).send("User not found");
    }
    
    res.render("Vanya/subscription", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      activePage: "subscription",
    });
  } catch (error) {
    console.error("Error rendering subscription:", error.message);
    res.status(500).send("Server Error: Unable to render subscription page");
  }
};

exports.getSkillQuiz = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const skillId = req.params.skillId;
    
    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();
    
    const skill = await Skill.findOne({ skillId }).lean();

    if (!skill) {
      return res.status(404).send("Skill not found");
    }

    if (!skill.questions || skill.questions.length === 0) {
      return res.status(400).send("No quiz available for this skill");
    }

    res.render("Vanya/quiz", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      skill: {
        skillId: skill.skillId,
        name: skill.name,
        questions: skill.questions,
      },
      activePage: "skills_badges",
    });
  } catch (error) {
    console.error("Error rendering quiz:", error.message);
    res.status(500).send("Server Error: Unable to render quiz page");
  }
};

exports.submitSkillQuiz = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const skillId = req.params.skillId;
    const freelancerId = req.session.user.roleId;
    const answers = req.body;

    console.log("Skill ID:", skillId);
    console.log("Freelancer ID:", freelancerId);
    console.log("Submitted Answers:", answers);

    const skill = await Skill.findOne({ skillId }).lean();
    if (!skill || !skill.questions || skill.questions.length === 0) {
      return res.status(404).json({ error: "Skill or quiz not found" });
    }

    let totalMarks = 0;
    let earnedMarks = 0;

    skill.questions.forEach((question) => {
      const userAnswer = answers[question.questionId];
      totalMarks += question.marks;

      if (userAnswer && userAnswer === question.correctAnswer) {
        earnedMarks += question.marks;
      }
    });

    const scorePercentage = (earnedMarks / totalMarks) * 100;
    const passed = scorePercentage >= 80;

    if (passed) {
      await Freelancer.updateOne(
        { freelancerId },
        { $addToSet: { skills: { skillId } } }
      );
    }

    res.json({
      success: true,
      passed,
      message: passed ? "Well Done!" : "Better Luck Next Time!",
      score: Math.round(scorePercentage),
    });
  } catch (error) {
    console.error("Error submitting quiz:", error.message);
    res.status(500).json({ error: "Server Error: Unable to submit quiz" });
  }
};

exports.getMilestone = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please log in");
    }

    const freelancerId = req.session.user.roleId;
    const { jobId } = req.params;
    
    // Fetch user data for proper user object construction
    const user = await User.findOne({ userId: req.session.user.id }).lean();

    const job = await JobListing.findOne({
      jobId,
      "assignedFreelancer.freelancerId": freelancerId,
      "assignedFreelancer.status": "working",
    }).lean();

    if (!job) {
      return res.status(404).send("Job not found or you are not authorized");
    }

    const employer = await Employer.findOne({
      employerId: job.employerId,
    }).lean();
    const companyName = employer ? employer.companyName : "Unknown Company";

    const totalAmount = parseFloat(job.budget.amount) || 0;
    const paidAmount = job.milestones
      .filter((m) => m.status === "paid")
      .reduce((sum, m) => sum + parseFloat(m.payment), 0);
    const paymentPercentage =
      totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
    const completedMilestones = job.milestones.filter(
      (m) => m.status === "paid"
    ).length;
    const completionPercentage = Math.round(
      (completedMilestones / job.milestones.length) * 100
    );

    const jobDetails = {
      jobId: job.jobId,
      title: job.title,
      company: companyName,
      milestones: job.milestones.map((m, index) => ({
        serialNo: index + 1,
        milestoneId: m.milestoneId,
        description: m.description,
        amount: parseFloat(m.payment),
        deadline: m.deadline
          ? new Date(m.deadline).toLocaleDateString()
          : "No deadline",
        status: m.status,
        requested: m.requested === "true" || m.requested === true, // Convert string "true"/"false" to boolean
      })),
      progress: {
        completionPercentage,
        payment: {
          paid: paidAmount,
          total: totalAmount,
          percentage: paymentPercentage,
        },
      },
    };

    res.render("Vanya/others/milestone", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription,
        role: user.role,
      },
      activePage: "payment",
      job: jobDetails,
    });
  } catch (error) {
    console.error("Error fetching milestones:", error.message);
    res.status(500).send("Error fetching milestones: " + error.message);
  }
};

exports.requestMilestone = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const freelancerId = req.session.user.roleId;
    const { jobId, milestoneId } = req.params;

    const job = await JobListing.findOne({
      jobId,
      "assignedFreelancer.freelancerId": freelancerId,
      "assignedFreelancer.status": "working",
    });

    if (!job) {
      return res
        .status(404)
        .json({ error: "Job not found or you are not authorized" });
    }

    const milestone = job.milestones.find((m) => m.milestoneId === milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (
      milestone.status === "paid" ||
      milestone.requested === "true" ||
      milestone.requested === true
    ) {
      return res
        .status(400)
        .json({ error: "Milestone already paid or requested" });
    }

    milestone.requested = true;
    await job.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error requesting milestone:", error.message);
    res.status(500).json({ error: "Failed to request milestone" });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const userId = req.session.user.id;
    if (!userId) {
      throw new Error("User ID not found in session");
    }

    const user = await User.findOne({ userId }).lean();
    if (!user) {
      throw new Error("User not found");
    }

    res.render("Vanya/subscription", {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        location: user.location,
        socialMedia: user.socialMedia,
        aboutMe: user.aboutMe,
        subscription: user.subscription || "Basic",
        role: user.role,
      },
      activePage: "subscription",
    });
  } catch (error) {
    console.error("Error fetching subscription:", error.message);
    res.status(500).send("Error fetching subscription: " + error.message);
  }
};

exports.upgradeSubscription = async (req, res) => {
  try {
    const user=req.session.user;
    const userId = req.session.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }
    // Update the user's subscription to "Premium"
    await User.updateOne({ userId }, { $set: { subscription: "Premium" } });
    req.session.user.subscription = "Premium";
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPaymentAnimation = (req, res) => {
  res.render("Vanya/others/payment", {
    activePage: "subscription",
  });
};

exports.submitComplaint = async (req, res) => {
  try {
    console.log("Freelancer complaint submission started");
    console.log("Job ID:", req.params.jobId);
    console.log("Request body:", req.body);
    console.log("User session:", req.session.user);
    
    const { jobId } = req.params;
    const { complaintType, againstUser, issue } = req.body;
    
    if (!req.session.user) {
      console.log("Unauthorized access attempt");
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }
    
    // Get job details to find employer
    const job = await JobListing.findOne({ jobId: jobId }).lean();
    console.log("Job found:", job);
    
    if (!job) {
      console.log("Job not found for ID:", jobId);
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Create complaint data
    const submittedById = req.session.user.id; // Fixed: use 'id' instead of 'userId'
    console.log("DEBUG: req.session.user.id =", submittedById);
    console.log("DEBUG: typeof submittedById =", typeof submittedById);
    
    const complaintData = {
      submittedBy: submittedById,
      againstUser: againstUser || job.employerId,
      complaintType: complaintType || "Job Related",
      jobId: jobId,
      issue: issue || "Issue with employer regarding job completion",
      status: "pending"
    };
    
    console.log("Creating complaint with data:", complaintData);
    
    // Create complaint
    const complaint = new Complaint(complaintData);
    const savedComplaint = await complaint.save();
    
    console.log("Complaint saved successfully:", savedComplaint);
    
    res.json({ 
      success: true, 
      message: "Complaint submitted successfully",
      complaintId: savedComplaint.complaintId
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Failed to submit complaint", details: error.message });
  }
};