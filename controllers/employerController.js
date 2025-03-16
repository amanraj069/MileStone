// controllers/employerController.js
const path = require("path");

exports.getEmployerDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/employer.html"));
};

exports.getEmployerProfile = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/view_profile.html"));
};

exports.getCurrentJobs = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/current_jobs.html"));
};

exports.getMilestones = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/milestone.html"));
};

exports.getSettings = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/settings.html"));
};

exports.getJobListings = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/job_listing.html"));
};

exports.getPreviouslyWorked = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/previously_worked.html"));
};

exports.getTransactionHistory = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/transaction.html"));
};

exports.getSubscription = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/subscription.html"));
};

exports.getSeeMoreDetails = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/see_more_detail.html"));
};

exports.getCurrentJobSeeMore = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/current_job_see_more.html"));
};
