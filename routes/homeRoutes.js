const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/jobs", homeController.getJobListing);
router.get("/jobs/:jobId", homeController.getJobDetails); // Updated route to use :jobId
router.post("/jobs/apply", homeController.applyForJob);

module.exports = router;
