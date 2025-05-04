const express = require("express");
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.authenticated) {
    return next();
  }
  res.redirect("/login?error=Please log in to access the dashboard");
};

// Employer Dashboard
router.get("/employerD/profile", isAuthenticated, (req, res) => {
  try {
    res.render("employerD/profile", {
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering employer dashboard:", error);
    res.status(500).send("Error loading employer dashboard");
  }
});

// Freelancer Dashboard
router.get("/freelancerD/profile", isAuthenticated, (req, res) => {
  try {
    res.render("freelancerD/profile", {
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering freelancer dashboard:", error);
    res.status(500).send("Error loading freelancer dashboard");
  }
});

// Admin Dashboard
router.get("/adminD/profile", isAuthenticated, (req, res) => {
  try {
    res.render("adminD/profile", {
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering admin dashboard:", error);
    res.status(500).send("Error loading admin dashboard");
  }
});

module.exports = router;