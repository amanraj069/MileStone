const path = require("path");
const fs = require("fs").promises;

exports.getAdminDashboard = (req, res) => {
  res.render("Jayanth/admin", {
    user: req.session.user,
    activeSection: "home",
  });
};

exports.getJobListings = (req, res) => {
  res.render("Jayanth/job_listings", {
    user: req.session.user,
    activeSection: "job_listings",
  });
};

exports.getFreelancers = (req, res) => {
  res.render("Jayanth/freelancers", {
    user: req.session.user,
    activeSection: "freelancers",
  });
};

exports.getEmployers = (req, res) => {
  res.render("Jayanth/employers", {
    user: req.session.user,
    activeSection: "employers",
  });
};

exports.getComplaints = (req, res) => {
  res.render("Jayanth/complaints", {
    user: req.session.user,
    activeSection: "complaints",
  });
};

exports.getProfile = (req, res) => {
  res.render("Jayanth/profile", {
    user: req.session.user,
    activeSection: "profile",
  });
};

exports.getEditProfile = (req, res) => {
  res.render("Jayanth/edit-profile", {
    user: req.session.user,
    activeSection: "profile",
  });
};