const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/").get(adminController.getAdminDashboard);
router.route("/profile").get(adminController.getProfile);
router.route("/job_listings").get(adminController.getJobListings);
router
  .route("/job_listings/see_more/:jobId")
  .get(adminController.getJobDetails); // New route for job details
router.route("/freelancers").get(adminController.getFreelancers);
router.route("/employers").get(adminController.getEmployers);
router.route("/complaints").get(adminController.getComplaints);

module.exports = router;
