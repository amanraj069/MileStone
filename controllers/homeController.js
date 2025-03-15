const path = require("path");

exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Aman", "home.html"));
};

exports.getVanya = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "Vanya", "active_job.html"));
};
