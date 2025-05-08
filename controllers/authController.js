const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { User, Employer, Freelancer, Admin } = require("../models");

exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !role) {
      return res.send(
        '<script>alert("Email, password, and role are required"); window.location="/signup";</script>'
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
        return res.send(
          '<script>alert("Invalid role"); window.location="/signup";</script>'
        );
    }

    // Save user and role entity sequentially
    await newUser.save();
    await roleEntity.save();

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
    // Validate required fields
    if (!email || !password || !role) {
      return res.redirect("/login?error=Missing email, password, or role");
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.redirect("/login?error=Invalid email or role");
    }

    // Check if user has a password
    if (!user.password) {
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
          return res.status(500).send("Server error during login");
        }

        console.log(`Redirecting ${role} to dashboard`);
        try {
          if (role === "Admin") {
            res.redirect("/adminD/profile");
          } else if (role === "Employer") {
            res.redirect("/employerD/profile");
          } else if (role === "Freelancer") {
            res.redirect("/freelancerD/profile");
          } else {
            console.error("Invalid role for redirect:", role);
            res.redirect("/?error=Invalid role");
          }
        } catch (redirectErr) {
          console.error("Redirect error:", redirectErr);
          res.status(500).send("Error redirecting to dashboard");
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
