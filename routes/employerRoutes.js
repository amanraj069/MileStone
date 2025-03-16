const express = require("express");
const employerController = require("../controllers/employerController");

const router = express.Router();

router.route("/").get(employerController.getEmployerDashboard);
router.route("/profile").get(employerController.getEmployerProfile);
router.route("/current-jobs").get(employerController.getCurrentJobs);
router.route("/milestones").get(employerController.getMilestones);
router.route("/settings").get(employerController.getSettings);
router.route("/job-listings").get(employerController.getJobListings);
router.route("/previously-worked").get(employerController.getPreviouslyWorked);
router.route("/transaction-history").get(employerController.getTransactionHistory);
router.route("/subscription").get(employerController.getSubscription);
router.route("/see-more-details").get(employerController.getSeeMoreDetails);
router.route("/current-job-details").get(employerController.getCurrentJobSeeMore);

module.exports = router;
