// routes/adminRoutes.js
const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/").get(adminController.getAdminDashboard);
// router.route("/job-listings").get(adminController.getJobListings);
router.route("/freelancers").get(adminController.getFreelancers);
router.route("/employers").get(adminController.getEmployers);
router.route("/complaints").get(adminController.getComplaints);
router.route("/settings").get(adminController.getSettings);

module.exports = router;
