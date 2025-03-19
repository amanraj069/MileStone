const express = require("express");
const freelancerController = require("../controllers/freelancerController");

const router = express.Router();

router.route("/profile").get(freelancerController.getFreelancerProfile);
router.route("/active_job").get(freelancerController.getFreelancerActiveJobs);
router.route("/active_job/chat").get(freelancerController.getChatsCurrentJobs);
router
  .route("/active_job/leave/:jobId")
  .delete(freelancerController.leaveActiveJob); // New route
router.route("/job_history").get(freelancerController.getFreelancerJobHistory);
router
  .route("/job_history/jhistory_see_more")
  .get(freelancerController.getSeemore);
router.route("/payment").get(freelancerController.getFreelancerPayment);
router.route("/skills_badges").get(freelancerController.getFreelancerSkills);
router
  .route("/subscription")
  .get(freelancerController.getFreelancerSubscription);

module.exports = router;
