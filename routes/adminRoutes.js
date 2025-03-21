const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/").get(adminController.getAdminDashboard);
router.route("/profile").get(adminController.getProfile);
router.route("/job_listings").get(adminController.getJobListings);
router
  .route("/job_listings/see_more/:jobId")
  .get(adminController.getJobDetails);
router.route("/freelancers").get(adminController.getFreelancers);
router.route("/employers").get(adminController.getEmployers);
router.route("/complaints").get(adminController.getComplaints);
router.route("/chat").get(adminController.getChatsCurrentJobs);

module.exports = router;
