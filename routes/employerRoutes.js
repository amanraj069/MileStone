const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");

router.get("/current_jobs", employerController.getCurrentJobs);
router.get("/job_listings", employerController.getJobListings);
router.get("/job_listings/new", employerController.getNewJobForm);
router.post("/job_listings/new", employerController.createJobListing);
router.get("/job_listings/edit/:jobId", employerController.getEditJobForm);
router.post("/job_listings/edit/:jobId", employerController.updateJobListing);
router.get("/job_applications", employerController.getJobApplications);
router.post("/job_applications/:applicationId/accept", employerController.acceptJobApplication);
router.post("/job_applications/:applicationId/reject", employerController.rejectJobApplication);
router.get("/profile", employerController.getProfile);
router.get("/transaction_history", employerController.getTransactionHistory);
router.get("/milestones", employerController.getMilestones);
router.get("/previously_worked", employerController.getPreviouslyWorked);
router.get("/subscription", employerController.getSubscription);
router.get("/transaction_history/milestone", employerController.getMilestone);

module.exports = router;