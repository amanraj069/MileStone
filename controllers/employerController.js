const path = require("path");

exports.getEmployerProfile = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/profile.html"));
};

exports.getJobListings = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/job_listing.html"));
};

exports.getCurrentJobs = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/current_jobs.html"));
};

exports.getPreviouslyWorked = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Abhishek/previously_worked.html")
  );
};

exports.getTransactionHistory = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/transaction.html"));
};

exports.getSubscription = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/subscription.html"));
};

exports.getChatsCurrentJobs = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/Abhishek/Additional/chat.html"));
};
exports.getSeemoreCurrentJobs = (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../views/Abhishek/Additional/current_job_see_more.html"
    )
  );
};
exports.geSeemoreJoblistings = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Abhishek/Additional/see_more_detail.html")
  );
};
exports.getmilestoneTransactionHistory = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Abhishek/Additional/milestone.html")
  );
};
exports.getDetailsofAppliers = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/Abhishek/Additional/view_profile.html")
  );
};
