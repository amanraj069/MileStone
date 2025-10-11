const JobListing = require("../models/job_listing");
const JobApplication = require("../models/job_application");
const User = require("../models/user");
const Employer = require("../models/employer");
const Freelancer = require("../models/freelancer");
const Complaint = require("../models/complaint");
const { uploadToCloudinary } = require("../middleware/imageUpload");

// Helper function to get complete user data for sidebar
const getUserData = async (userId) => {
  try {
    const user = await User.findOne({ userId }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return {
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Return session data as fallback
    return null;
  }
};

const employerController = {
  getCurrentJobs: async (req, res) => {
    try {
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const jobs = await JobListing.find({
        employerId,
        status: "closed",
        "assignedFreelancer.freelancerId": { $ne: "" },
        "assignedFreelancer.status": "working",
      }).lean();

      const freelancerIds = jobs.map(job => job.assignedFreelancer.freelancerId).filter(id => id);

      const freelancers = await Freelancer.find({ freelancerId: { $in: freelancerIds } })
        .select("freelancerId skills")
        .lean();
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId userId name picture")
        .lean();

      const freelancersWithDetails = jobs.map(job => {
        const freelancer = freelancers.find(f => f.freelancerId === job.assignedFreelancer.freelancerId);
        const user = users.find(u => u.roleId === job.assignedFreelancer.freelancerId);
        return {
          jobId: job.jobId,
          projectName: job.title,
          skills: freelancer?.skills || job.description.skills || [],
          startDate: job.assignedFreelancer.startDate,
          freelancer: {
            id: job.assignedFreelancer.freelancerId,
            userId: user?.userId || "", // Include userId from User table
            name: user?.name || "Unknown Freelancer",
            picture: user?.picture || "/assets/user_female.png",
            rating: 4.7,
          },
        };
      });

      const userData = await getUserData(req.session.user.id) || req.session.user;

      res.render("Abhishek/current_jobs", {
        user: userData,
        activePage: "current_jobs",
        freelancers: freelancersWithDetails,
      });
    } catch (error) {
      console.error("Error fetching current jobs:", error.message);
      res.status(500).send("Error fetching current jobs: " + error.message);
    }
  },

  getPreviouslyWorked: async (req, res) => {
    try {
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const jobs = await JobListing.find({
        employerId,
        status: "closed",
        "assignedFreelancer.freelancerId": { $ne: "" },
        "assignedFreelancer.status": "finished",
      }).lean();

      const freelancerIds = jobs.map(job => job.assignedFreelancer.freelancerId).filter(id => id);

      const freelancers = await Freelancer.find({ freelancerId: { $in: freelancerIds } })
        .select("freelancerId skills")
        .lean();
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId name picture")
        .lean();

      const freelancersWithDetails = jobs.map(job => {
        const freelancer = freelancers.find(f => f.freelancerId === job.assignedFreelancer.freelancerId);
        const user = users.find(u => u.roleId === job.assignedFreelancer.freelancerId);
        const completionDate = job.updatedAt || new Date();
        return {
          jobId: job.jobId,
          projectName: job.title,
          skills: freelancer?.skills || job.description.skills || [],
          completionDate,
          freelancer: {
            id: job.assignedFreelancer.freelancerId,
            name: user?.name || "Unknown Freelancer",
            picture: user?.picture || "/assets/user_female.png",
            rating: 4.7,
          },
        };
      });

      const userData = await getUserData(req.session.user.id) || req.session.user;

      res.render("Abhishek/previously_worked", {
        user: userData,
        activePage: "previously_worked",
        freelancers: freelancersWithDetails,
      });
    } catch (error) {
      console.error("Error fetching previously worked freelancers:", error.message);
      res.status(500).send("Error fetching previously worked freelancers: " + error.message);
    }
  },

  getJobListings: async (req, res) => {
    try {
      const employerId = req.session.user.roleId;
      const userId = req.session.user.id;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      // Get complete user data for sidebar
      const userData = await getUserData(userId) || req.session.user;

      const jobListings = await JobListing.find({
        employerId,
        status: { $nin: ["closed", "completed"] },
      })
        .sort({ postedDate: -1 })
        .lean();

      res.render("Abhishek/job_listing", {
        user: userData,
        activePage: "job_listings",
        jobListings,
      });
    } catch (error) {
      console.error("Error fetching job listings:", error.message);
      res.status(500).send("Error fetching job listings: " + error.message);
    }
  },

  getNewJobForm: async (req, res) => {
    const userData = await getUserData(req.session.user.id) || req.session.user;
    res.render("Abhishek/others/new_job", {
      user: userData,
      activePage: "job_listings",
    });
  },

  createJobListing: async (req, res) => {
    try {
      const {
        title,
        budget,
        location,
        jobType,
        experienceLevel,
        remote,
        applicationDeadline,
        description,
        milestones,
      } = req.body;

      const employerId = req.session.user.roleId;
      const userId = req.session.user.id;
      if (!employerId || !userId) {
        throw new Error("Employer roleId or userId not found in session");
      }

      // Get employer's profile image from user data
      const user = await User.findOne({ userId });
      const employerImageUrl = user?.picture || 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png';

      const newJob = new JobListing({
        employerId,
        imageUrl: employerImageUrl,
        title,
        budget: {
          amount: Number(budget.amount),
          period: budget.period,
        },
        location,
        jobType,
        experienceLevel,
        remote: remote === "true",
        applicationDeadline,
        description: {
          text: description?.text || '',
          responsibilities: description?.responsibilities
            ? description.responsibilities.split("\n").filter((r) => r.trim())
            : [],
          requirements: description?.requirements
            ? description.requirements.split("\n").filter((r) => r.trim())
            : [],
          skills: description?.skills
            ? description.skills.split("\n").filter((s) => s.trim())
            : [],
        },
        milestones: milestones && Array.isArray(milestones) ? milestones.map((m) => ({
          description: m.description,
          deadline: m.deadline,
          payment: m.payment,
          status: "not-paid",
          requested: false,
        })) : [],
      });

      await newJob.save();
      res.redirect("/employerD/job_listings");
    } catch (error) {
      console.error("Error creating job listing:", error.message);
      res.status(500).send("Error creating job listing: " + error.message);
    }
  },

  getEditJobForm: async (req, res) => {
    try {
      const { jobId } = req.params;
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const job = await JobListing.findOne({ jobId, employerId }).lean();
      if (!job) {
        throw new Error("Job not found or you are not authorized to edit it");
      }

      res.render("Abhishek/others/update_job", {
        user: { name: req.session.user.name },
        activePage: "job_listings",
        job,
      });
    } catch (error) {
      console.error("Error fetching job for editing:", error.message);
      res.status(500).send("Error fetching job for editing: " + error.message);
    }
  },

  updateJobListing: async (req, res) => {
    try {
      const { jobId } = req.params;
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const {
        title,
        budget,
        imageUrl,
        location,
        jobType,
        experienceLevel,
        remote,
        applicationDeadline,
        description,
        milestones,
      } = req.body;

      const updatedJob = {
        imageUrl,
        title,
        budget: {
          amount: Number(budget.amount),
          period: budget.period,
        },
        location,
        jobType,
        experienceLevel,
        remote: remote === "true",
        applicationDeadline,
        description: {
          text: description.text,
          responsibilities: description.responsibilities
            .split("\n")
            .filter((r) => r.trim()),
          requirements: description.requirements
            .split("\n")
            .filter((r) => r.trim()),
          skills: description.skills.split("\n").filter((s) => s.trim()),
        },
        milestones: milestones.map((m) => ({
          description: m.description,
          deadline: m.deadline,
          payment: m.payment,
          status: m.status || "not-paid",
          requested: m.requested === 'true' || m.requested === true,
        })),
      };

      const job = await JobListing.findOneAndUpdate(
        { jobId, employerId },
        { $set: updatedJob },
        { new: true }
      );

      if (!job) {
        throw new Error("Job not found or you are not authorized to update it");
      }

      res.redirect("/employerD/job_listings");
    } catch (error) {
      console.error("Error updating job listing:", error.message);
      res.status(500).send("Error updating job listing: " + error.message);
    }
  },

  getJobApplications: async (req, res) => {
    try {
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const jobs = await JobListing.find({ employerId }).lean();
      const jobIds = jobs.map((job) => job.jobId);

      const applications = await JobApplication.find({
        jobId: { $in: jobIds },
      }).lean();

      const freelancerIds = [
        ...new Set(applications.map((app) => app.freelancerId)),
      ];
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId name picture")
        .lean();

      const applicationsWithDetails = applications.map((application) => {
        const job = jobs.find((job) => job.jobId === application.jobId);
        const user = users.find(
          (user) => user.roleId === application.freelancerId
        );
        return {
          ...application,
          jobTitle: job?.title || "Unknown Job",
          freelancerName: user?.name || "Unknown Freelancer",
          freelancerPicture: user?.picture || null,
        };
      });

      const userData = await getUserData(req.session.user.id) || req.session.user;

      res.render("Abhishek/job_applications", {
        user: userData,
        activePage: "job_applications",
        applications: applicationsWithDetails,
      });
    } catch (error) {
      console.error("Error fetching job applications:", error.message);
      res.status(500).send("Error fetching job applications: " + error.message);
    }
  },

  acceptJobApplication: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const application = await JobApplication.findOne({ applicationId });
      if (!application) {
        throw new Error("Application not found");
      }

      const job = await JobListing.findOne({ jobId: application.jobId });
      if (!job || job.employerId !== employerId) {
        throw new Error("Not authorized to modify this application");
      }

      await JobApplication.findOneAndUpdate(
        { applicationId },
        { $set: { status: "Accepted" } }
      );

      await JobListing.findOneAndUpdate(
        { jobId: application.jobId },
        {
          $set: {
            "assignedFreelancer.freelancerId": application.freelancerId,
            "assignedFreelancer.startDate": new Date(),
            "assignedFreelancer.status": "working",
            status: "closed",
          },
        }
      );

      res.redirect("/employerD/job_applications");
    } catch (error) {
      console.error("Error accepting job application:", error.message);
      res.status(500).send("Error accepting job application: " + error.message);
    }
  },

  rejectJobApplication: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const employerId = req.session?.user?.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const application = await JobApplication.findOne({ applicationId });
      if (!application) {
        throw new Error("Application not found");
      }

      const job = await JobListing.findOne({ jobId: application.jobId });
      if (!job || job.employerId !== employerId) {
        throw new Error("Not authorized to modify this application");
      }

      await JobApplication.findOneAndUpdate(
        { applicationId },
        { $set: { status: "Rejected" } }
      );

      res.redirect("/employerD/job_applications");
    } catch (error) {
      console.error("Error rejecting job application:", error.message);
      res.status(500).send("Error rejecting job application: " + error.message);
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const employerId = req.session.user.roleId;

      if (!userId || !employerId) {
        throw new Error("User ID or Employer roleId not found in session");
      }

      // Fetch fresh data from database
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error("User not found");
      }

      const employer = await Employer.findOne({ employerId }).lean();
      if (!employer) {
        throw new Error("Employer not found");
      }

      // Log for debugging
      console.log("User picture from DB:", user.picture);
      console.log("User picture from session:", req.session.user.picture);

      res.render("Abhishek/profile", {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          picture: user.picture, // Use fresh data from database
          location: user.location,
          socialMedia: user.socialMedia || {},
          aboutMe: user.aboutMe,
          subscription: user.subscription,
          role: user.role,
        },
        company: {
          name: employer.companyName,
          website: employer.websiteLink,
        },
        activePage: "profile",
      });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      res.status(500).send("Error fetching profile: " + error.message);
    }
  },

  getEditProfile: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const employerId = req.session.user.roleId;

      if (!userId || !employerId) {
        throw new Error("User ID or Employer roleId not found in session");
      }

      const user = await User.findOne({ userId }).lean();
      if (!user) {
        throw new Error("User not found");
      }

      const employer = await Employer.findOne({ employerId }).lean();
      if (!employer) {
        throw new Error("Employer not found");
      }

      res.render("Abhishek/others/edit-profile", {
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
        company: {
          name: employer.companyName,
          website: employer.websiteLink,
        },
        activePage: "education",
      });
    } catch (error) {
      console.error("Error fetching edit profile:", error.message);
      res.status(500).send("Error fetching edit profile: " + error.message);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const employerId = req.session.user.roleId;

      if (!userId || !employerId) {
        throw new Error("User ID or Employer roleId not found in session");
      }

      const {
        companyName,
        location,
        websiteLink,
        email,
        phone,
        linkedinUrl,
        twitterUrl,
        facebookUrl,
        instagramUrl,
        aboutContent,
      } = req.body;

      // Handle image upload - use new image URL if uploaded, otherwise keep existing
      let pictureUrl = req.session.user.picture; // Default to existing picture
      if (req.file) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.buffer);
          pictureUrl = uploadResult.secure_url; // Cloudinary secure URL
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          throw new Error("Failed to upload image. Please try again.");
        }
      }

      const userUpdate = {
        email,
        phone,
        picture: pictureUrl,
        location,
        socialMedia: {
          linkedin: linkedinUrl || "",
          twitter: twitterUrl || "",
          facebook: facebookUrl || "",
          instagram: instagramUrl || "",
        },
        aboutMe: aboutContent,
      };

      const employerUpdate = {
        companyName,
        websiteLink,
      };

      const user = await User.findOneAndUpdate(
        { userId },
        { $set: userUpdate },
        { new: true }
      );
      if (!user) {
        throw new Error("User not found");
      }

      const employer = await Employer.findOneAndUpdate(
        { employerId },
        { $set: employerUpdate },
        { new: true }
      );
      if (!employer) {
        throw new Error("Employer not found");
      }

      req.session.user.name = user.name;
      req.session.user.email = user.email;
      req.session.user.picture = user.picture;

      res.redirect("/employerD/profile");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).send("Error updating profile: " + error.message);
    }
  },

  getTransactionHistory: async (req, res) => {
    try {
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }
  
      const jobs = await JobListing.find({
        employerId,
        status: "closed",
        "assignedFreelancer.freelancerId": { $ne: "" },
        "assignedFreelancer.status": { $in: ["working", "finished"] }
      }).lean();
  
      const freelancerIds = jobs.map(job => job.assignedFreelancer.freelancerId).filter(id => id);
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId name picture")
        .lean();
  
      const transactions = jobs.map(job => {
        const user = users.find(u => u.roleId === job.assignedFreelancer.freelancerId);
        return {
          jobId: job.jobId,
          projectTitle: job.title,
          amount: job.budget.amount,
          startDate: job.assignedFreelancer.startDate,
          status: job.assignedFreelancer.status,
          freelancer: {
            id: job.assignedFreelancer.freelancerId,
            name: user?.name || "Unknown Freelancer",
            picture: user?.picture || "/assets/user_female.png"
          }
        };
      });
  
      const userData = await getUserData(req.session.user.id) || req.session.user;
  
      res.render("Abhishek/transaction", {
        user: userData,
        activePage: "transaction_history",
        transactions: transactions
      });
    } catch (error) {
      console.error("Error fetching transaction history:", error.message);
      res.status(500).send("Error fetching transaction history: " + error.message);
    }
  },

  getMilestone: async (req, res) => {
    try {
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }
  
      const { jobId } = req.query;
      const query = {
        employerId,
        "assignedFreelancer.freelancerId": { $ne: "" },
        "assignedFreelancer.status": { $in: ["working", "finished"] }
      };
  
      if (jobId) {
        query.jobId = jobId;
      }
  
      const jobs = await JobListing.find(query).lean();
  
      const freelancerIds = jobs.map(job => job.assignedFreelancer.freelancerId).filter(id => id);
      const freelancers = await Freelancer.find({ freelancerId: { $in: freelancerIds } })
        .select("freelancerId skills")
        .lean();
      const users = await User.find({ roleId: { $in: freelancerIds } })
        .select("roleId name picture")
        .lean();
  
      const jobDetails = jobs.map(job => {
        const freelancer = freelancers.find(f => f.freelancerId === job.assignedFreelancer.freelancerId);
        const user = users.find(u => u.roleId === job.assignedFreelancer.freelancerId);
  
        const totalAmount = job.budget.amount;
        const paidAmount = job.milestones
          .filter(m => m.status === "paid")
          .reduce((sum, m) => sum + parseFloat(m.payment || 0), 0);
        const paymentPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
        const completedMilestones = job.milestones.filter(m => m.status === "paid").length;
        const completionPercentage = job.milestones.length > 0 ? Math.round((completedMilestones / job.milestones.length) * 100) : 0;
  
        const milestonesWithDebug = job.milestones.map((m, index) => {
          const isRequested = m.requested === true || m.requested === 'true';
          console.log(`Job ${job.jobId}, Milestone ${m.milestoneId}: status=${m.status}, requested=${m.requested}, isRequested=${isRequested}`);
          return {
            serialNo: index + 1,
            milestoneId: m.milestoneId,
            description: m.description,
            amount: parseFloat(m.payment || 0),
            deadline: m.deadline || "No deadline",
            status: m.status,
            requested: isRequested,
          };
        });
  
        return {
          jobId: job.jobId,
          title: job.title,
          freelancer: {
            id: job.assignedFreelancer.freelancerId,
            name: user?.name || "Unknown Freelancer",
            picture: user?.picture || "/assets/user_female.png",
            status: job.assignedFreelancer.status
          },
          milestones: milestonesWithDebug,
          progress: {
            completionPercentage,
            payment: {
              paid: paidAmount,
              total: totalAmount,
              percentage: paymentPercentage,
            },
          },
        };
      });
  
      res.render("Abhishek/others/milestone", {
        user: {
          name: req.session.user.name,
          email: req.session.user.email,
        },
        activePage: "transaction_history",
        jobs: jobDetails,
      });
    } catch (error) {
      console.error("Error fetching milestones:", error.message);
      res.status(500).send("Error fetching milestones: " + error.message);
    }
  },

  getSubscription: async (req, res) => {
    try {
      const userId = req.session.user.id;
      if (!userId) {
        throw new Error("User ID not found in session");
      }

      const user = await User.findOne({ userId }).lean();
      if (!user) {
        throw new Error("User not found");
      }

      res.render("Abhishek/subscription", {
        user: {
          name: user.name,
          picture: user.picture,
          role: user.role,
          subscription: user.subscription || "Basic",
        },
        activePage: "subscription",
      });
    } catch (error) {
      console.error("Error fetching subscription:", error.message);
      res.status(500).send("Error fetching subscription: " + error.message);
    }
  },

  upgradeSubscription: async (req, res) => {
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
  },

  payMilestone: async (req, res) => {
    try {
      const { jobId, milestoneId } = req.params;
      const employerId = req.session.user.roleId;
      if (!employerId) {
        throw new Error("Employer roleId not found in session");
      }

      const job = await JobListing.findOne({ jobId, employerId });
      if (!job) {
        throw new Error("Job not found or you are not authorized");
      }

      const milestone = job.milestones.find(m => m.milestoneId === milestoneId);
      if (!milestone) {
        throw new Error("Milestone not found");
      }

      milestone.status = "paid";
      milestone.requested = false;

      const allMilestonesPaid = job.milestones.every(m => m.status === "paid");
      if (allMilestonesPaid) {
        job.assignedFreelancer.status = "finished";
      }

      await job.save();

      res.json({ success: true });
    } catch (error) {
      console.error("Error paying milestone:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getViewprofile: (req, res) => {
    res.render("Abhishek/others/view_profile", {
      user: { name: req.session.user.name },
      activePage: "transaction_history",
    });
  },
  
  getPaymentAnimation: (req, res) => {
    res.render("Abhishek/others/payment", {
      activePage: "subscription",
    });
  },
  
  getComplaintPage: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { id: employerId } = req.session.user;

      // Get job details
      const job = await JobListing.findOne({ jobId: jobId }).lean();
      
      if (!job) {
        return res.status(404).send("Job not found");
      }

      // Get freelancer details if assigned
      let freelancer = null;
      
      if (job.assignedFreelancer && job.assignedFreelancer.freelancerId) {
        // The assignedFreelancer.freelancerId contains the user's roleId, not userId
        freelancer = await User.findOne({ roleId: job.assignedFreelancer.freelancerId }).lean();
      }

      res.render("Abhishek/submit_complaint", {
        user: req.session.user,
        job: job,
        freelancer: freelancer,
        jobId: jobId,
        activePage: 'submit_complaint'
      });
    } catch (error) {
      console.error("Error loading complaint page:", error);
      res.status(500).send("Internal server error");
    }
  },

  submitComplaint: async (req, res) => {
    try {
      console.log("Employer complaint submission started");
      console.log("Job ID:", req.params.jobId);
      console.log("Request body:", req.body);
      console.log("User session:", req.session.user);
      
      const { jobId } = req.params;
      const { complaintType, againstUser, issue } = req.body;
      
      if (!req.session.user) {
        console.log("Unauthorized access attempt");
        return res.status(401).json({ error: "Unauthorized: Please log in" });
      }
      
      // Get job details to find freelancer
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
        againstUser: againstUser || (job.assignedFreelancer ? job.assignedFreelancer.freelancerId : null),
        complaintType: complaintType || "Job Related",
        jobId: jobId,
        issue: issue || "Issue with freelancer regarding job completion",
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
  },

  uploadProfileImage: async (req, res) => {
    try {
      const userId = req.session.user.id;

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in session" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      // Upload image to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      const pictureUrl = uploadResult.secure_url;

      // Update user's picture in database
      const user = await User.findOneAndUpdate(
        { userId },
        { $set: { picture: pictureUrl } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update session
      req.session.user.picture = user.picture;

      res.json({ 
        success: true, 
        message: "Profile image updated successfully",
        imageUrl: pictureUrl 
      });

    } catch (error) {
      console.error("Error uploading profile image:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload image: " + error.message 
      });
    }
  },
};

module.exports = employerController;