// controllers/adminController.js
const path = require("path");

exports.getAdminDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/admin.html"));
};

exports.getJobListings = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/job_listings.html"));
};

exports.getFreelancers = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/freelancers.html"));
};

exports.getEmployers = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/employers.html"));
};

exports.getComplaints = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/complaints.html"));
};

exports.getSettings = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Jayanth/settings.html"));
};
