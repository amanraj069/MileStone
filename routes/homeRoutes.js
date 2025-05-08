const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/blog", homeController.getBlog);
router.get("/chat/:userId", homeController.getChat);
router.post("/chat/:userId", homeController.sendMessage);
router.get("/jobs", homeController.getJobListing);
router.get("/jobs/:jobId", homeController.getJobDetails);
router.get("/jobs/apply/:jobId", homeController.getJobApplication);
router.post("/jobs/apply/:jobId", homeController.applyForJob);
router.get(
  "/jobs/application-submitted/:jobId",
  homeController.getApplicationSubmitted
);

router.get("/profile/:freelancerId", homeController.getProfile);

module.exports = router;