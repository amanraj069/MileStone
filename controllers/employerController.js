// controllers/employerController.js
const path = require("path");

exports.getEmployerDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "employerD", "employer.html"));
};
