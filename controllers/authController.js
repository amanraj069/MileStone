const path = require("path");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(
        '<script>alert("Email already exists"); window.location="/signup";</script>'
      );
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      name
    });

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.log("Signup catch error:", error);
    res.send(
      '<script>alert("Error creating account"); window.location="/signup";</script>'
    );
  }
};

exports.postLogin = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Find user by email and role
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.redirect("/login?error=Invalid email or role");
    }
    
    // Check password
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      // Set user session
      req.session.user = {
        id: user._id, // Note: MongoDB uses _id instead of id
        email: user.email,
        role: user.role,
        name: user.name,
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
          return res.status(500).send("Server error during login");
        }
        
        console.log(`Redirecting ${role} to dashboard`);
        if (role === "Admin") {
          res.redirect("/adminD/profile");
        } else if (role === "Employer") {
          res.redirect("/employerD/profile");
        } else if (role === "Freelancer") {
          res.redirect("/freelancerD/profile");
        }
      });
    } else {
      res.redirect("/login?error=Incorrect password");
    }
  } catch (error) {
    console.error("Login error:", error);
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

exports.getHome = (req, res) => {
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
  res.render("Aman/home", {
    user: req.session.user || null,
    dashboardRoute: dashboardRoute,
  });
};