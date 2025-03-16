const path = require("path");

exports.getFreelancerProfile = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/profile.html"));
};

exports.getFreelancerActiveJobs = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/active_job.html"));
};

exports.getFreelancerJobHistory = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/job_history.html"));
};

exports.getFreelancerPayment = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/payment.html"));
};

exports.getFreelancerSkills = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/skills_badges.html"));
};

exports.getFreelancerSubscription = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/Vanya/subscription.html"));
};
