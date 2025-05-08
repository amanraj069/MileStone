const express = require("express");
const freelancerController = require("../controllers/freelancerController");
const employerController = require("../controllers/employerController");

const router = express.Router();

router.route("/profile").get(freelancerController.getFreelancerProfile);
router.route("/profile/edit").get(freelancerController.getEditFreelancerProfile);
router.route("/profile/update").post(freelancerController.updateFreelancerProfile);
router.route("/active_job").get(freelancerController.getFreelancerActiveJobs);
router
  .route("/active_job/leave/:jobId")
  .delete(freelancerController.leaveActiveJob);
router.route("/job_history").get(freelancerController.getFreelancerJobHistory);
router.route("/payment").get(freelancerController.getFreelancerPayment);
router.route("/skills_badges").get(freelancerController.getFreelancerSkills);

// router.route("/subscription").get(freelancerController.getFreelancerSubscription);
router.get("/subscription", freelancerController.getSubscription);
router.get("/payment_success", freelancerController.getPaymentAnimation);
router.post("/upgrade_subscription", freelancerController.upgradeSubscription);

router.route("/skills_badges/quiz/:skillId").get(freelancerController.getSkillQuiz);
router.route("/skills_badges/quiz/:skillId").post(freelancerController.submitSkillQuiz);
router.route("/milestone/:jobId").get(freelancerController.getMilestone);
router.post("/milestone/:jobId/:milestoneId/request", freelancerController.requestMilestone);

module.exports = router;