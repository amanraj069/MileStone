// controllers/freelancerController.js
const path = require("path");

exports.getFreelancerDashboard = (req, res) => {
  // Assuming Vanya's freelancer dashboard is in views/Vanya
  res.sendFile(path.join(__dirname, "../views", "Vanya", "freelancer.html"));
};
