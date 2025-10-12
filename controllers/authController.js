const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { User, Employer, Freelancer, Admin } = require("../models");
const JobListing = require("../models/job_listing");

exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const isAjax = req.headers['content-type'] === 'application/json';

  try {
    // Validate required fields
    if (!email || !password || !role) {
      const error = "Email, password, and role are required";
      if (isAjax) {
        return res.status(400).json({ error });
      }
      return res.send(
        '<script>alert("Email, password, and role are required"); window.location="/signup";</script>'
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = "Email already exists";
      if (isAjax) {
        return res.status(400).json({ error });
      }
      return res.send(
        '<script>alert("Email already exists"); window.location="/signup";</script>'
      );
    }

    // Generate UUID for roleId and userId
    const roleId = uuidv4();
    const userId = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      userId,
      email,
      password: hashedPassword,
      role,
      roleId,
      name: name || "",
    });

    // Create corresponding role-specific tuple
    let roleEntity;
    switch (role.toLowerCase()) {
      case "employer":
        roleEntity = new Employer({
          employerId: roleId,
          userId,
        });
        break;
      case "freelancer":
        roleEntity = new Freelancer({
          freelancerId: roleId,
          userId,
        });
        break;
      case "admin":
        roleEntity = new Admin({
          adminId: roleId,
          userId,
        });
        break;
      default:
        const error = "Invalid role";
        if (isAjax) {
          return res.status(400).json({ error });
        }
        return res.send(
          '<script>alert("Invalid role"); window.location="/signup";</script>'
        );
    }

    // Save user and role entity sequentially
    await newUser.save();
    await roleEntity.save();

    // Set user session immediately after signup
    req.session.user = {
      id: newUser.userId,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      roleId: newUser.roleId,
      authenticated: true,
    };

    // Determine dashboard URL based on role
    let dashboardUrl;
    switch (role) {
      case "Admin":
        dashboardUrl = "/adminD/profile";
        break;
      case "Employer":
        dashboardUrl = "/employerD/profile";
        break;
      case "Freelancer":
        dashboardUrl = "/freelancerD/profile";
        break;
      default:
        dashboardUrl = "/login";
    }

    // Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error during signup:", err);
        const errorMessage = "Error saving session";
        if (isAjax) {
          return res.status(500).json({ error: errorMessage });
        }
        return res.redirect("/signup?error=Session error");
      }

      if (isAjax) {
        return res.status(201).json({ 
          success: true, 
          message: "Account created successfully",
          redirectUrl: dashboardUrl
        });
      }
      res.redirect(dashboardUrl);
    });
  } catch (error) {
    console.log("Signup catch error:", error);
    const errorMessage = "Error creating account";
    if (isAjax) {
      return res.status(500).json({ error: errorMessage });
    }
    res.send(
      '<script>alert("Error creating account"); window.location="/signup";</script>'
    );
  }
};

exports.postLogin = async (req, res) => {
  const { email, password, role } = req.body;
  const isAjax = req.headers['content-type'] === 'application/json';

  try {
    // Validate required fields
    if (!email || !password || !role) {
      const error = "Missing email, password, or role";
      if (isAjax) {
        return res.status(400).json({ error });
      }
      return res.redirect("/login?error=Missing email, password, or role");
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });

    if (!user) {
      const error = "Invalid email or role";
      if (isAjax) {
        return res.status(401).json({ error });
      }
      return res.redirect("/login?error=Invalid email or role");
    }

    // Check if user has a password
    if (!user.password) {
      const error = "Account has no password set";
      if (isAjax) {
        return res.status(401).json({ error });
      }
      return res.redirect("/login?error=Account has no password set");
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Set user session
      req.session.user = {
        id: user.userId,
        email: user.email,
        role: user.role,
        name: user.name,
        roleId: user.roleId,
        authenticated: true,
      };

      console.log(
        "User logged in, session set:",
        req.session.user,
        "Session ID:",
        req.sessionID
      );

      // Save session and redirect
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          const errorMessage = "Server error during login";
          if (isAjax) {
            return res.status(500).json({ error: errorMessage });
          }
          return res.status(500).send("Server error during login");
        }

        console.log(`Redirecting ${role} to dashboard`);
        try {
          let redirectUrl;
          if (role === "Admin") {
            redirectUrl = "/adminD/profile";
          } else if (role === "Employer") {
            redirectUrl = "/employerD/profile";
          } else if (role === "Freelancer") {
            redirectUrl = "/freelancerD/profile";
          } else {
            console.error("Invalid role for redirect:", role);
            const error = "Invalid role";
            if (isAjax) {
              return res.status(400).json({ error });
            }
            return res.redirect("/?error=Invalid role");
          }

          if (isAjax) {
            return res.status(200).json({ 
              success: true,
              message: "Login successful",
              redirectUrl
            });
          }
          res.redirect(redirectUrl);
        } catch (redirectErr) {
          console.error("Redirect error:", redirectErr);
          const errorMessage = "Error redirecting to dashboard";
          if (isAjax) {
            return res.status(500).json({ error: errorMessage });
          }
          res.status(500).send("Error redirecting to dashboard");
        }
      });
    } else {
      const error = "Incorrect password";
      if (isAjax) {
        return res.status(401).json({ error });
      }
      res.redirect("/login?error=Incorrect password");
    }
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = "Server error";
    if (isAjax) {
      return res.status(500).json({ error: errorMessage });
    }
    res.redirect("/login?error=Server error");
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
};

exports.getHome = async (req, res) => {
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

  try {
    // Fetch featured jobs
    const featuredJobs = await JobListing.find({
      "featured.isActive": true,
      status: { $in: ["open", "active"] }
    })
    .sort({ "featured.featuredAt": -1 })
    .limit(3)
    .lean();

    // Get employer details for featured jobs
    const formattedFeaturedJobs = await getFeaturedJobsWithDetails(featuredJobs);

    res.render("Aman/home", {
      user: req.session.user || null,
      dashboardRoute: dashboardRoute,
      featuredJobs: formattedFeaturedJobs,
    });
  } catch (error) {
    console.error('Error fetching featured jobs for home page:', error);
    res.render("Aman/home", {
      user: req.session.user || null,
      dashboardRoute: dashboardRoute,
      featuredJobs: [],
    });
  }
};

// Helper function to get featured jobs with employer details
async function getFeaturedJobsWithDetails(featuredJobs = null) {
  try {
    // If no jobs passed, fetch them
    let jobs = featuredJobs;
    if (!jobs) {
      jobs = await JobListing.find({
        'featured.isFeatured': true,
        status: { $in: ["open", "active"] }
      })
      .sort({ "featured.featuredAt": -1 })
      .limit(3)
      .lean();
    }

    if (!jobs.length) {
      return [];
    }

    // Get unique employer IDs
    const employerIds = [...new Set(jobs.map(job => job.employerId))];
    
    // Get employer details using employerId field (not _id)
    const employers = await Employer.find({
      employerId: { $in: employerIds }
    }).lean();

    // Create employer lookup map using employerId
    const employerMap = employers.reduce((map, employer) => {
      map[employer.employerId] = employer;
      return map;
    }, {});

    // Format jobs with employer details
    const formattedJobs = jobs.map(job => {
      const employer = employerMap[job.employerId];
      
      // Get category icon based on job skills
      const categoryIcon = getCategoryIcon(job.category, job.description?.skills || []);
      
      // Create budget range
      const budgetRange = createBudgetRange(job.budget.amount);
      
      // Calculate time since posted
      const timeAgo = getTimeAgo(job.postedDate);
      
      // Get description excerpt
      const descriptionExcerpt = getDescriptionExcerpt(job.description?.text || '');
      
      return {
        ...job,
        employer: employer,
        category: job.featured?.type || 'web-development',
        categoryIcon: categoryIcon,
        budgetRange: budgetRange,
        timeAgo: timeAgo,
        descriptionExcerpt: descriptionExcerpt,
        skills: (job.description?.skills || []).slice(0, 3) // Show only first 3 skills
      };
    });

    return formattedJobs;
  } catch (error) {
    console.error('Error fetching featured jobs with details:', error);
    return [];
  }
}

// Helper functions for formatting featured jobs
function getCategoryIcon(category, skills) {
  const skillsLower = skills.map(skill => skill.toLowerCase());
  
  // Check for web development
  if (skillsLower.some(skill => 
    ['javascript', 'react', 'angular', 'vue', 'html', 'css', 'node'].some(tech => skill.includes(tech)))) {
    return 'fas fa-code';
  }
  
  // Check for design
  if (skillsLower.some(skill => 
    ['design', 'photoshop', 'figma', 'illustrator', 'ui', 'ux'].some(tech => skill.includes(tech)))) {
    return 'fas fa-paint-brush';
  }
  
  // Check for writing
  if (skillsLower.some(skill => 
    ['writing', 'content', 'copywriting', 'blog'].some(tech => skill.includes(tech)))) {
    return 'fas fa-pen-nib';
  }
  
  // Check for data science
  if (skillsLower.some(skill => 
    ['python', 'data', 'analytics', 'sql', 'machine learning'].some(tech => skill.includes(tech)))) {
    return 'fas fa-chart-line';
  }
  
  // Check for marketing
  if (skillsLower.some(skill => 
    ['marketing', 'seo', 'social media', 'advertising'].some(tech => skill.includes(tech)))) {
    return 'fas fa-bullhorn';
  }
  
  // Default to software development
  return 'fas fa-laptop-code';
}

function createBudgetRange(amount) {
  const minVariation = Math.floor(amount * 0.7); // 30% less
  const maxVariation = Math.floor(amount * 1.3); // 30% more
  
  return {
    min: minVariation,
    max: maxVariation,
    formatted: `₹${minVariation.toLocaleString()} - ₹${maxVariation.toLocaleString()}`
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
    return '1 day';
  } else if (diffDays <= 30) {
    return `${diffDays} days`;
  } else {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  }
}

function getDescriptionExcerpt(description) {
  if (!description) return 'No description available';
  
  const words = description.split(' ');
  const excerpt = words.slice(0, 18).join(' '); // Take first 18 words
  
  return words.length > 18 ? `${excerpt}...` : excerpt;
}
