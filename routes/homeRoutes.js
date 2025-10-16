const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/blog", homeController.getBlogPage);
router.get("/blog/:blogId", homeController.getBlogPost);
router.get("/chat/:userId", homeController.getChat);
router.post("/chat/:userId", homeController.sendMessage);

// Chat API Routes
router.post("/chat/:userId/api/send", homeController.sendMessageAPI);
router.get("/chat/:userId/api/messages", homeController.getMessagesAPI);
router.get("/chat/:userId/api/status", homeController.getUserStatusAPI);
router.get("/chat/:userId/api/stats", homeController.getChatStatsAPI);

router.get("/jobs", homeController.getJobListing);
// API endpoint to fetch public job listings as JSON
router.get("/jobs/api", homeController.getJobListingAPI);
router.get("/jobs/:jobId", homeController.getJobDetails);
router.get("/jobs/apply/:jobId", homeController.getJobApplication);
router.post("/jobs/apply/:jobId", homeController.applyForJob);
router.get(
  "/jobs/application-submitted/:jobId",
  homeController.getApplicationSubmitted
);

router.get("/profile/:freelancerId", homeController.getProfile);

module.exports = router;
