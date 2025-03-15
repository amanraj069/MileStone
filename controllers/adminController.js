// controllers/adminController.js
const path = require("path");

exports.getAdminDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "adminD", "admin.html"));
};
