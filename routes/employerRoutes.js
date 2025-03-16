const express = require("express");
const employerController = require("../controllers/employerController");

const router = express.Router();

router.route("/").get(employerController.getEmployerProfile);
router.route("/profile").get(employerController.getEmployerProfile);
router.route("/job-listings").get(employerController.getJobListings);
router
  .route("/job-listings/see_more")
  .get(employerController.geSeemoreJoblistings);

router.route("/current-jobs").get(employerController.getCurrentJobs);
router.route("/current-jobs/chat").get(employerController.getChatsCurrentJobs);
router
  .route("/current-jobs/see_more")
  .get(employerController.getSeemoreCurrentJobs);
router
  .route("/current-jobs/see_more/view_details")
  .get(employerController.getDetailsofAppliers);
router.route("/previously-worked").get(employerController.getPreviouslyWorked);
router
  .route("/transaction-history")
  .get(employerController.getTransactionHistory);
router
  .route("/transaction-history/milestone")
  .get(employerController.getmilestoneTransactionHistory);
router.route("/subscription").get(employerController.getSubscription);

module.exports = router;
