// controllers/employerController.js
const path = require("path");

exports.getEmployerDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Abhishek/employer.html"));
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
