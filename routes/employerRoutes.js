const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");

router.get("/current_jobs", employerController.getCurrentJobs);
router.get("/job_listings", employerController.getJobListings);
router.get("/job_listings/new", employerController.getNewJobForm);
router.post("/job_listings/new", employerController.createJobListing);
router.get("/job_listings/edit/:jobId", employerController.getEditJobForm);
router.post("/job_listings/edit/:jobId", employerController.updateJobListing);
router.get("/profile", employerController.getProfile);
router.get("/transaction_history", employerController.getTransactionHistory);
router.get("/milestones", employerController.getMilestones);
router.get("/previously_worked", employerController.getPreviouslyWorked);
router.get("/subscription", employerController.getSubscription);

module.exports = router;