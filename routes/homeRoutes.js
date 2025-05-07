const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/jobs", homeController.getJobListing);
router.get("/jobs/:jobId", homeController.getJobDetails);
router.get("/jobs/apply/:jobId", homeController.getJobApplication);
router.post("/jobs/apply/:jobId", homeController.applyForJob);
router.get(
  "/jobs/application-submitted/:jobId",
  homeController.getApplicationSubmitted
);

router.get("/profile", homeController.getProfile);

module.exports = router;